import os
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import Policy, Comment
from .analyzer import analyze_comment
from .serializers import (
    PolicySerializer, PolicyDetailSerializer, CommentSerializer,
    UserSerializer, RegisterSerializer
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """GET /api/ — Interactive API Root Index listing all available PolicyPulse REST endpoints."""
    return Response({
        'message': 'Welcome to PolicyPulse Government API',
        'auth_endpoints': {
            'register': '/api/auth/register/',
            'login': '/api/auth/login/',
            'me': '/api/auth/me/',
            'token_refresh': '/api/auth/token/refresh/',
            'password_reset': '/api/auth/password-reset/',
            'password_reset_confirm': '/api/auth/password-reset-confirm/',
        },
        'policy_endpoints': {
            'list_policies': '/api/policies/',
            'detail_policy': '/api/policies/<id>/',
            'policy_comments': '/api/policies/<id>/comments/',
            'policy_metrics': '/api/policies/<id>/metrics/',
        },
        'staff_panel': '/panel/'
    })


class RegisterView(APIView):
    """POST /api/auth/register/ — Register new citizen user account."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """POST /api/auth/login/ — Obtain JWT tokens for citizen login."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        # Match by email or username
        if '@' in username:
            matched_user = User.objects.filter(email__iexact=username).first()
            if matched_user:
                username = matched_user.username

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)


class CurrentUserView(APIView):
    """GET /api/auth/me/ — Get current authenticated citizen details."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ── Password Reset Endpoints ─────────────────────────────────────

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

class PasswordResetRequestView(APIView):
    """POST /api/auth/password-reset/ — Request password reset email."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            if email:
                # Match by email or username
                user = User.objects.filter(email__iexact=email).first() or User.objects.filter(username__iexact=email).first()
                if user:
                    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                    token = default_token_generator.make_token(user)
                    frontend_url = os.getenv('FRONTEND_URL', 'https://policy-pulse-delta.vercel.app').rstrip('/')
                    reset_url = f"{frontend_url}/reset-password/{uidb64}/{token}/"

                    subject = "PolicyPulse — Reset Your Account Password"
                    message = f"Hello {user.username},\n\nA password reset request was received for your PolicyPulse citizen account.\n\nPlease click the link below to set a new password:\n{reset_url}\n\nIf you did not request this reset, please ignore this email.\n\nGovernment of Tamil Nadu — PolicyPulse Team"
                    
                    try:
                        send_mail(
                            subject,
                            message,
                            settings.DEFAULT_FROM_EMAIL,
                            [user.email or email],
                            fail_silently=True,
                        )
                        print(f"[PasswordReset DISPATCH LINK]: {reset_url}")
                    except Exception as e:
                        print(f"[PasswordReset Error] Failed to send email: {e}")

            return Response({
                'detail': 'If an account with that email exists, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)
        except Exception as main_e:
            print(f"[PasswordReset Exception]: {main_e}")
            return Response({
                'detail': 'If an account with that email exists, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """POST /api/auth/password-reset-confirm/ — Submit new password using reset token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uidb64', '')
        token = request.data.get('token', '')
        new_password = request.data.get('new_password') or request.data.get('password', '')

        if not uidb64 or not token or not new_password:
            return Response({'error': 'Missing reset token or new password.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired password reset link.'}, status=status.HTTP_400_BAD_REQUEST)


# ── Policy Endpoints ─────────────────────────────────────────────

class PolicyListView(APIView):
    """GET /api/policies/ — Active legislative policies for public frontend."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        policies = Policy.objects.filter(is_active=True).order_by('-published_date')
        serializer = PolicySerializer(policies, many=True)
        return Response(serializer.data)


class PolicyDetailView(APIView):
    """GET /api/policies/<id>/ — Single policy with all its details."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        policy = get_object_or_404(Policy, pk=pk, is_active=True)
        serializer = PolicyDetailSerializer(policy)
        return Response(serializer.data)


# ── Comment Endpoints ─────────────────────────────────────────────

class CommentListCreateView(APIView):
    PAGE_SIZE = 10

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, policy_id):
        policy = get_object_or_404(Policy, id=policy_id, is_active=True)
        qs = Comment.objects.filter(policy=policy)

        # --- Filtering ---
        sentiment = request.query_params.get('sentiment')
        issue = request.query_params.get('issue')
        sort = request.query_params.get('sort', 'newest')

        if sentiment and sentiment != 'all':
            if sentiment == 'Mixed':
                qs = qs.filter(sentiment__in=['Mixed', 'Neutral'])
            else:
                qs = qs.filter(sentiment=sentiment)

        if issue and issue != 'all':
            qs = qs.filter(issue=issue)

        # --- Sorting ---
        if sort == 'supportive':
            from django.db.models import Case, When, IntegerField
            qs = qs.annotate(
                sort_order=Case(
                    When(sentiment='Positive', then=0),
                    default=1,
                    output_field=IntegerField()
                )
            ).order_by('sort_order', '-created_at')
        elif sort == 'critical':
            from django.db.models import Case, When, IntegerField
            qs = qs.annotate(
                sort_order=Case(
                    When(sentiment='Negative', then=0),
                    default=1,
                    output_field=IntegerField()
                )
            ).order_by('sort_order', '-created_at')
        else:
            qs = qs.order_by('-created_at')

        # --- Pagination ---
        total = qs.count()
        try:
            page = max(1, int(request.query_params.get('page', 1)))
        except ValueError:
            page = 1

        total_pages = max(1, (total + self.PAGE_SIZE - 1) // self.PAGE_SIZE)
        page = min(page, total_pages)
        start = (page - 1) * self.PAGE_SIZE
        end = start + self.PAGE_SIZE
        comments = qs[start:end]

        serializer = CommentSerializer(comments, many=True)
        return Response({
            'count': total,
            'total_pages': total_pages,
            'current_page': page,
            'results': serializer.data,
        })

    def post(self, request, policy_id):
        try:
            policy = get_object_or_404(Policy, id=policy_id, is_active=True)

            text = request.data.get('text', '').strip()
            author_input = request.data.get('author', '').strip()
            author = author_input or getattr(request.user, 'username', 'Verified Citizen')

            if not text:
                return Response({'error': 'Comment text is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # STRICT LIMIT: 1 Comment per Logged-in User per Policy
            if request.user and request.user.is_authenticated:
                existing = Comment.objects.filter(policy=policy, user=request.user).exists()
                if existing:
                    return Response(
                        {'error': 'You have already submitted feedback for this policy proposal.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Run AI analysis server-side (Gemini 3.6 Flash with fallback)
            analysis = analyze_comment(text)
            if not isinstance(analysis, dict):
                analysis = {
                    'sentiment': 'Neutral',
                    'issue': 'General',
                    'why': (text[:50] + "...") if len(text) > 50 else text
                }

            user_obj = request.user if (request.user and request.user.is_authenticated) else None

            comment = Comment.objects.create(
                policy=policy,
                user=user_obj,
                author=author,
                text=text,
                sentiment=analysis.get('sentiment', 'Neutral'),
                issue=analysis.get('issue', 'General'),
                why=analysis.get('why', ''),
            )

            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"[CommentCreate Error] Exception: {e}")
            return Response(
                {'error': f'Failed to record comment: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ── Dashboard metrics endpoint ────────────────────────────────────

class PolicyMetricsView(APIView):
    """GET /api/policies/<id>/metrics/ — Public sentiment dashboard stats for charts."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            policy = get_object_or_404(Policy, pk=pk, is_active=True)
            comments = Comment.objects.filter(policy=policy)

            total = comments.count()
            pos = comments.filter(sentiment='Positive').count()
            neg = comments.filter(sentiment='Negative').count()
            mix = comments.filter(sentiment__in=['Mixed', 'Neutral']).count()

            if total > 0:
                pos_pct = round((pos / total) * 100)
                neg_pct = round((neg / total) * 100)
                mix_pct = max(0, 100 - pos_pct - neg_pct)
            else:
                pos_pct, neg_pct, mix_pct = 0, 0, 0

            issue_counts = {}
            for c in comments:
                if c.issue:
                    issue_counts[c.issue] = issue_counts.get(c.issue, 0) + 1

            return Response({
                'policy_id': policy.id,
                'policy_title': policy.title,
                'total_responses': total,
                'positive_pct': pos_pct,
                'neutral_pct': mix_pct,
                'negative_pct': neg_pct,
                'issue_counts': issue_counts,
                'sentiment': {
                    'positive': pos,
                    'negative': neg,
                    'mixed': mix,
                },
                'issues_breakdown': [{'issue': k, 'count': v} for k, v in issue_counts.items()]
            })
        except Exception as e:
            print(f"[PolicyMetrics Error]: {e}")
            return Response({
                'policy_id': int(pk),
                'policy_title': 'Policy Analytics',
                'total_responses': 0,
                'positive_pct': 0,
                'neutral_pct': 0,
                'negative_pct': 0,
                'issue_counts': {},
                'sentiment': {'positive': 0, 'negative': 0, 'mixed': 0},
                'issues_breakdown': []
            })
