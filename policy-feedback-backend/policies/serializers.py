from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Policy, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class CommentSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True, default='')

    class Meta:
        model = Comment
        fields = [
            'id', 'policy', 'user', 'username', 'author', 'text',
            'sentiment', 'issue', 'why',
            'created_at', 'timestamp',
        ]
        read_only_fields = ['id', 'user', 'sentiment', 'issue', 'why', 'created_at', 'timestamp']

    def get_timestamp(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        diff = now - obj.created_at
        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            mins = int(diff.total_seconds() // 60)
            return f"{mins} min{'s' if mins > 1 else ''} ago"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() // 3600)
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        else:
            days = diff.days
            return f"{days} day{'s' if days > 1 else ''} ago"


class PolicySerializer(serializers.ModelSerializer):
    published_date = serializers.DateField(format='%a, %b %d')
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Policy
        fields = ['id', 'title', 'content', 'published_date', 'is_active', 'created_at', 'comment_count']
        read_only_fields = ['id', 'published_date', 'created_at', 'comment_count']


class PolicyDetailSerializer(PolicySerializer):
    class Meta(PolicySerializer.Meta):
        fields = PolicySerializer.Meta.fields
