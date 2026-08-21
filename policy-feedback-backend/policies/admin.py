from django.contrib import admin
from .models import Policy, Comment

# Admin Portal Branding
admin.site.site_header = "Tamil Nadu Policy Portal Admin"
admin.site.site_title = "TN Policy Admin"
admin.site.index_title = "State Policy & Feedback Management"


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'published_date', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'content']
    list_editable = ['is_active']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user_username', 'author', 'policy', 'sentiment_badge', 'issue', 'created_at']
    list_filter = ['sentiment', 'issue', 'policy']
    search_fields = ['author', 'text', 'user__username', 'user__email']
    readonly_fields = ['sentiment', 'issue', 'why', 'created_at']

    def has_add_permission(self, request):
        return False

    @admin.display(description='Registered User')
    def user_username(self, obj):
        return obj.user.username if obj.user else 'Anonymous'

    @admin.display(description='Sentiment')
    def sentiment_badge(self, obj):
        color_map = {
            'Positive': '#10b981',
            'Negative': '#ef4444',
            'Mixed': '#f59e0b',
            'Neutral': '#94a3b8'
        }
        bg_color = color_map.get(obj.sentiment, '#94a3b8')
        from django.utils.html import format_html
        return format_html(
            '<span style="background-color: {}; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">{}</span>',
            bg_color,
            obj.sentiment
        )
