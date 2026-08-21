from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q, Count
from policies.models import Policy, Comment

from django.contrib.auth import logout

LOGIN_URL = '/admin/login/'

def panel_logout_view(request):
    """POST/GET /panel/logout/ — Log out staff user and redirect to login."""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('/admin/login/?next=/panel/')

@staff_member_required(login_url=LOGIN_URL)
def dashboard_view(request):
    """GET /panel/ — Staff Dashboard overview."""
    total_policies = Policy.objects.count()
    active_policies = Policy.objects.filter(is_active=True).count()
    inactive_policies = total_policies - active_policies
    total_comments = Comment.objects.count()

    pos_comments = Comment.objects.filter(sentiment='Positive').count()
    neu_comments = Comment.objects.filter(sentiment='Neutral').count()
    mix_comments = Comment.objects.filter(sentiment='Mixed').count()
    neg_comments = Comment.objects.filter(sentiment='Negative').count()

    recent_comments = Comment.objects.select_related('policy').order_by('-created_at')[:6]
    recent_policies = Policy.objects.order_by('-published_date')[:5]

    context = {
        'total_policies': total_policies,
        'active_policies': active_policies,
        'inactive_policies': inactive_policies,
        'total_comments': total_comments,
        'pos_comments': pos_comments,
        'neu_comments': neu_comments + mix_comments,
        'neg_comments': neg_comments,
        'recent_comments': recent_comments,
        'recent_policies': recent_policies,
    }
    return render(request, 'panel/dashboard.html', context)


@staff_member_required(login_url=LOGIN_URL)
def policy_list_view(request):
    """GET /panel/policies/ — Policy proposals table."""
    policies_qs = Policy.objects.annotate(comments_total=Count('comments')).order_by('-published_date')
    paginator = Paginator(policies_qs, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
    }
    return render(request, 'panel/policy_list.html', context)


@staff_member_required(login_url=LOGIN_URL)
def policy_create_view(request):
    """GET/POST /panel/policies/create/ — Create new policy proposal."""
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        is_active = request.POST.get('is_active') == 'on'

        if not title or not content:
            messages.error(request, 'Please provide both a policy title and description content.')
        else:
            policy = Policy.objects.create(
                title=title,
                content=content,
                is_active=is_active
            )
            messages.success(request, f'Policy proposal "{policy.title}" created successfully!')
            return redirect('panel-policy-list')

    return render(request, 'panel/policy_form.html', {'action': 'Create', 'policy': None})


@staff_member_required(login_url=LOGIN_URL)
def policy_edit_view(request, pk):
    """GET/POST /panel/policies/<id>/edit/ — Edit existing policy proposal."""
    policy = get_object_or_404(Policy, pk=pk)

    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        is_active = request.POST.get('is_active') == 'on'

        if not title or not content:
            messages.error(request, 'Please provide both a policy title and description content.')
        else:
            policy.title = title
            policy.content = content
            policy.is_active = is_active
            policy.save()
            messages.success(request, f'Policy proposal "{policy.title}" updated successfully!')
            return redirect('panel-policy-list')

    return render(request, 'panel/policy_form.html', {'action': 'Edit', 'policy': policy})


@staff_member_required(login_url=LOGIN_URL)
def policy_toggle_active_view(request, pk):
    """POST /panel/policies/<id>/toggle/ — Toggle policy active status."""
    if request.method == 'POST':
        policy = get_object_or_404(Policy, pk=pk)
        policy.is_active = not policy.is_active
        policy.save()
        status_str = 'Activated' if policy.is_active else 'Deactivated'
        messages.success(request, f'Policy "{policy.title}" has been {status_str}.')
    return redirect('panel-policy-list')


@staff_member_required(login_url=LOGIN_URL)
def policy_delete_view(request, pk):
    """GET/POST /panel/policies/<id>/delete/ — Delete policy proposal."""
    policy = get_object_or_404(Policy, pk=pk)

    if request.method == 'POST':
        title = policy.title
        policy.delete()
        messages.success(request, f'Policy proposal "{title}" deleted successfully.')
        return redirect('panel-policy-list')

    return render(request, 'panel/confirm_delete.html', {
        'object_name': f'Policy: {policy.title}',
        'cancel_url': 'panel-policy-list'
    })


@staff_member_required(login_url=LOGIN_URL)
def comment_list_view(request):
    """GET /panel/comments/ — Searchable, filterable citizen comments table."""
    comments_qs = Comment.objects.select_related('policy', 'user').order_by('-created_at')

    # Filtering
    search_q = request.GET.get('q', '').strip()
    policy_filter = request.GET.get('policy', '').strip()
    sentiment_filter = request.GET.get('sentiment', '').strip()

    if search_q:
        comments_qs = comments_qs.filter(
            Q(text__icontains=search_q) |
            Q(author__icontains=search_q) |
            Q(why__icontains=search_q)
        )

    if policy_filter and policy_filter != 'all':
        comments_qs = comments_qs.filter(policy_id=policy_filter)

    if sentiment_filter and sentiment_filter != 'all':
        comments_qs = comments_qs.filter(sentiment=sentiment_filter)

    paginator = Paginator(comments_qs, 15)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    all_policies = Policy.objects.all().order_by('title')

    context = {
        'page_obj': page_obj,
        'search_q': search_q,
        'policy_filter': policy_filter,
        'sentiment_filter': sentiment_filter,
        'all_policies': all_policies,
    }
    return render(request, 'panel/comment_list.html', context)


@staff_member_required(login_url=LOGIN_URL)
def comment_delete_view(request, pk):
    """GET/POST /panel/comments/<id>/delete/ — Delete citizen comment."""
    comment = get_object_or_404(Comment, pk=pk)

    if request.method == 'POST':
        author = comment.author
        comment.delete()
        messages.success(request, f'Comment by {author} deleted successfully.')
        return redirect('panel-comment-list')

    return render(request, 'panel/confirm_delete.html', {
        'object_name': f'Comment by {comment.author} on "{comment.policy.title}"',
        'cancel_url': 'panel-comment-list'
    })
