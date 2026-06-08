from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Avg, Count
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import timedelta
from apps.services.models import Service
from apps.blogs.models import Blog
from apps.gallery.models import GalleryItem
from apps.contacts.models import Contact
from apps.feedback.models import Feedback
from apps.solutions.models import PastSolution


def last_n_months(n=6):
    """Return list of month labels and date ranges for the last n months."""
    today = timezone.now()
    months = []
    for i in range(n - 1, -1, -1):
        d = (today.replace(day=1) - timedelta(days=i * 28)).replace(day=1)
        months.append(d)
    return months


class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)

        # ── Overview counts ──────────────────────────────────────────
        overview = {
            'services': {
                'total': Service.objects.count(),
                'active': Service.objects.filter(is_active=True).count(),
            },
            'solutions': {
                'total': PastSolution.objects.count(),
                'active': PastSolution.objects.filter(is_active=True).count(),
                'deployed': PastSolution.objects.filter(status='deployed').count(),
                'in_development': PastSolution.objects.filter(status='in_development').count(),
                'ready_to_launch': PastSolution.objects.filter(status='ready_to_launch').count(),
            },
            'blogs': {
                'total': Blog.objects.count(),
                'published': Blog.objects.filter(status='published').count(),
                'draft': Blog.objects.filter(status='draft').count(),
                'total_views': Blog.objects.aggregate(v=Count('views'))['v'] or 0,
            },
            'gallery': {
                'total': GalleryItem.objects.count(),
                'events': GalleryItem.objects.filter(type='event').count(),
                'general': GalleryItem.objects.filter(type='general').count(),
            },
            'contacts': {
                'total': Contact.objects.count(),
                'unread': Contact.objects.filter(is_read=False).count(),
                'read': Contact.objects.filter(is_read=True).count(),
                'this_month': Contact.objects.filter(created_at__gte=thirty_days_ago).count(),
                'this_week': Contact.objects.filter(created_at__gte=seven_days_ago).count(),
            },
            'feedback': {
                'total': Feedback.objects.count(),
                'approved': Feedback.objects.filter(is_approved=True).count(),
                'pending': Feedback.objects.filter(is_approved=False).count(),
                'average_rating': _average_rating(),
            },
        }

        # ── Contacts over last 6 months (line chart) ─────────────────
        contacts_trend = []
        for m in last_n_months(6):
            next_m = (m.replace(day=28) + timedelta(days=4)).replace(day=1)
            count = Contact.objects.filter(created_at__gte=m, created_at__lt=next_m).count()
            contacts_trend.append({
                'month': m.strftime('%b %Y'),
                'contacts': count,
            })

        # ── Contacts by interest (pie/donut chart) ────────────────────
        interest_breakdown = list(
            Contact.objects.values('interest')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # ── Feedback ratings distribution (bar chart) ─────────────────
        rating_dist = []
        for r in range(1, 6):
            rating_dist.append({
                'rating': f'{r}★',
                'count': Feedback.objects.filter(rating=r).count(),
            })

        # ── Blog posts per category (bar chart) ───────────────────────
        blog_by_category = list(
            Blog.objects.values('category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # ── Blog posts over last 6 months ─────────────────────────────
        blogs_trend = []
        for m in last_n_months(6):
            next_m = (m.replace(day=28) + timedelta(days=4)).replace(day=1)
            count = Blog.objects.filter(created_at__gte=m, created_at__lt=next_m).count()
            blogs_trend.append({
                'month': m.strftime('%b %Y'),
                'posts': count,
            })

        # ── Recent contacts (activity feed) ──────────────────────────
        recent_contacts = list(
            Contact.objects.order_by('-created_at')[:5].values(
                'id', 'name', 'company_name', 'interest', 'is_read', 'created_at'
            )
        )
        for c in recent_contacts:
            c['created_at'] = c['created_at'].isoformat()

        # ── Recent feedback ───────────────────────────────────────────
        recent_feedback = list(
            Feedback.objects.order_by('-created_at')[:5].values(
                'id', 'name', 'company', 'rating', 'is_approved', 'created_at'
            )
        )
        for f in recent_feedback:
            f['created_at'] = f['created_at'].isoformat()

        return Response({
            **overview,
            'charts': {
                'contacts_trend': contacts_trend,
                'interest_breakdown': interest_breakdown,
                'rating_distribution': rating_dist,
                'blog_by_category': blog_by_category,
                'blogs_trend': blogs_trend,
            },
            'recent': {
                'contacts': recent_contacts,
                'feedback': recent_feedback,
            },
        })


def _average_rating():
    result = Feedback.objects.filter(is_approved=True).aggregate(avg=Avg('rating'))
    avg = result['avg']
    return round(avg, 1) if avg else 0
