from django.db import models
from django.contrib.auth.models import User


class Policy(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    published_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Policies'

    def __str__(self):
        return self.title


class Comment(models.Model):
    SENTIMENT_CHOICES = [
        ('Positive', 'Positive'),
        ('Negative', 'Negative'),
        ('Mixed', 'Mixed'),
        ('Neutral', 'Neutral'),
    ]

    ISSUE_CHOICES = [
        ('Affordability', 'Affordability'),
        ('Safety & Quality', 'Safety & Quality'),
        ('Accessibility', 'Accessibility'),
        ('Resource Allocation', 'Resource Allocation'),
        ('General', 'General'),
    ]

    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    author = models.CharField(max_length=100, default='Anonymous Citizen')
    text = models.TextField()
    # AI-analyzed fields (computed server-side on submission)
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, default='Neutral')
    issue = models.CharField(max_length=50, choices=ISSUE_CHOICES, default='General')
    why = models.TextField(default='')
    contact_info = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['policy', 'user'],
                condition=models.Q(user__isnull=False),
                name='unique_policy_user_comment'
            )
        ]

    def __str__(self):
        user_str = self.user.username if self.user else self.author
        return f'{user_str} on "{self.policy.title}" — {self.sentiment}'
