"""
AI-Solution URL Configuration

API Endpoints:
  AUTH:
    POST   /api/auth/login/          - Admin login (returns JWT tokens)
    POST   /api/auth/refresh/        - Refresh JWT token
    POST   /api/auth/logout/         - Logout

  SERVICES:
    GET    /api/services/            - List all services (public)
    POST   /api/services/            - Create service (admin)
    GET    /api/services/<id>/       - Get service detail (public)
    PUT    /api/services/<id>/       - Update service (admin)
    DELETE /api/services/<id>/       - Delete service (admin)

  BLOGS:
    GET    /api/blogs/               - List all blogs (public)
    POST   /api/blogs/               - Create blog (admin)
    GET    /api/blogs/<id>/          - Get blog detail (public)
    PUT    /api/blogs/<id>/          - Update blog (admin)
    DELETE /api/blogs/<id>/          - Delete blog (admin)
    GET    /api/blogs/?category=<x>  - Filter by category

  GALLERY:
    GET    /api/gallery/             - List all gallery items (public)
    POST   /api/gallery/             - Upload gallery item (admin)
    GET    /api/gallery/<id>/        - Get gallery item detail (public)
    PUT    /api/gallery/<id>/        - Update gallery item (admin)
    DELETE /api/gallery/<id>/        - Delete gallery item (admin)
    GET    /api/gallery/?type=event  - Filter by type (event/general)

  CONTACTS:
    GET    /api/contacts/            - List all contacts (admin only)
    POST   /api/contacts/            - Submit contact form (public)
    GET    /api/contacts/<id>/       - Get contact detail (admin)
    PATCH  /api/contacts/<id>/       - Mark as read (admin)
    DELETE /api/contacts/<id>/       - Delete contact (admin)

  FEEDBACK:
    GET    /api/feedback/            - List all feedback (public)
    POST   /api/feedback/            - Submit feedback (public)
    GET    /api/feedback/<id>/       - Get feedback detail
    PATCH  /api/feedback/<id>/       - Approve/hide feedback (admin)
    DELETE /api/feedback/<id>/       - Delete feedback (admin)

  STATS (Admin Dashboard):
    GET    /api/stats/               - Dashboard stats summary (admin)
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import AdminLoginView, AdminLogoutView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='api-home'),
    path('django-admin/', admin.site.urls),

    # Auth endpoints
    path('api/auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/auth/logout/', AdminLogoutView.as_view(), name='admin-logout'),

    # Resource endpoints
    path('api/services/', include('apps.services.urls')),
    path('api/blogs/', include('apps.blogs.urls')),
    path('api/gallery/', include('apps.gallery.urls')),
    path('api/contacts/', include('apps.contacts.urls')),
    path('api/feedback/', include('apps.feedback.urls')),
    path('api/team/', include('apps.team.urls')),
    path('api/solutions/', include('apps.solutions.urls')),
    path('api/stats/', include('apps.accounts.stats_urls')),
    path('api/chat/', include('apps.chatbot.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
