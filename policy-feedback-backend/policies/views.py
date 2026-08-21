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
        'message': 'Welcome to PolicyPulse REST API Root',
        'auth_register': request.build_absolute_uri('/api/auth/register/'),
        'auth_login': request.build_absolute_uri('/api/auth/login/'),
        'auth_me': request.build_absolute_uri('/api/auth/me/'),
        'policies': request.build_absolute_uri('/api/policies/'),
    })


# ── Auth Endpoints ────────────────────────────────────────────────

class RegisterView(APIView):
    """POST /api/auth/register/ — Register a new citizen account."""
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
    """POST /api/auth/login/ — Login and receive JWT token pair."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class CurrentUserView(APIView):
    """GET /api/auth/me/ — Get current authenticated user profile."""
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
        email = request.data.get('email', '').strip().lower()
        if email:
            # Match by email or username
            user = User.objects.filter(email__iexact=email).first() or User.objects.filter(username__iexact=email).first()
            if user:
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
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
                        fail_silently=False,
                    )
                    print(f"[PasswordReset] Reset email dispatched to {user.email or email}")
                except Exception as e:
                    print(f"[PasswordReset Error] Failed to send email: {e}")

        # Always return generic success message to prevent email enumeration
        return Response({
            'detail': 'If an account with that email exists, a password reset link has been sent.'
        }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """POST /api/auth/password-reset-confirm/ — Submit new password using reset token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uidb64', '').strip()
        token = request.data.get('token', '').strip()
        new_password = request.data.get('new_password', '').strip()

        if not uidb64 or not token or not new_password:
            return Response({'error': 'Missing required fields (uidb64, token, new_password).'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({'error': 'Password must be at least 6 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid reset link or user account not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'The password reset token is invalid or has expired. Please request a new link.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            'detail': 'Your password has been reset successfully. You may now sign in.'
        }, status=status.HTTP_200_OK)


# ── Policy Endpoints ──────────────────────────────────────────────

class PolicyListView(APIView):
    """GET /api/policies/ — List all active policies."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        policies = Policy.objects.filter(is_active=True)
        serializer = PolicySerializer(policies, many=True)
        return Response(serializer.data)


class PolicyDetailView(APIView):
    """GET /api/policies/<id>/ — Single policy with all its comments."""
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
    permission_classes = [permissions.AllowAny]

    def get(self, request, policy_id):
        policy = get_object_or_404(Policy, id=policy_id, is_active=True)
        comments = Comment.objects.filter(policy=policy)
        total = comments.count()

        if total == 0:
            return Response({
                'total': 0,
                'positive_pct': 0,
                'neutral_pct': 0,
                'negative_pct': 0,
                'issue_counts': {},
                'reasons_for_support': [],
                'concerns': [],
            })

        pos = comments.filter(sentiment='Positive').count()
        neu = comments.filter(sentiment__in=['Neutral', 'Mixed']).count()
        neg = comments.filter(sentiment='Negative').count()

        issue_counts = {}
        for issue_choice, _ in Comment.ISSUE_CHOICES:
            issue_counts[issue_choice] = comments.filter(issue=issue_choice).count()

        support_qs = comments.filter(sentiment='Positive').values('author', 'why')[:4]
        concerns_qs = comments.filter(sentiment__in=['Negative', 'Mixed']).values('author', 'why')[:4]

        return Response({
            'total': total,
            'positive_pct': round((pos / total) * 100),
            'neutral_pct': round((neu / total) * 100),
            'negative_pct': round((neg / total) * 100),
            'issue_counts': issue_counts,
            'reasons_for_support': list(support_qs),
            'concerns': list(concerns_qs),
        })
