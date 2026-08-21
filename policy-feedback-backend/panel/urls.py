from django.urls import path
from .views import (
    dashboard_view, policy_list_view, policy_create_view, policy_edit_view,
    policy_toggle_active_view, policy_delete_view, comment_list_view, comment_delete_view,
    panel_logout_view
)

urlpatterns = [
    path('', dashboard_view, name='panel-dashboard'),
    path('logout/', panel_logout_view, name='panel-logout'),
    path('policies/', policy_list_view, name='panel-policy-list'),
    path('policies/create/', policy_create_view, name='panel-policy-create'),
    path('policies/<int:pk>/edit/', policy_edit_view, name='panel-policy-edit'),
    path('policies/<int:pk>/toggle/', policy_toggle_active_view, name='panel-policy-toggle'),
    path('policies/<int:pk>/delete/', policy_delete_view, name='panel-policy-delete'),
    path('comments/', comment_list_view, name='panel-comment-list'),
    path('comments/<int:pk>/delete/', comment_delete_view, name='panel-comment-delete'),
]
