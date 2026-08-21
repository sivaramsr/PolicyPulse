from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    api_root, PolicyListView, PolicyDetailView, CommentListCreateView,
    PolicyMetricsView, RegisterView, LoginView, CurrentUserView,
    PasswordResetRequestView, PasswordResetConfirmView
)

urlpatterns = [
    # API Root Listing
    path('', api_root, name='api-root'),

    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='auth-me'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='auth-password-reset'),
    path('auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='auth-password-reset-confirm'),

    # Policies Endpoints
    path('policies/', PolicyListView.as_view(), name='policy-list'),
    path('policies/<int:pk>/', PolicyDetailView.as_view(), name='policy-detail'),

    # Comments Endpoints (filtered, sorted, paginated)
    path('policies/<int:policy_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),

    # Dashboard Metrics Endpoint
    path('policies/<int:policy_id>/metrics/', PolicyMetricsView.as_view(), name='policy-metrics'),
]
