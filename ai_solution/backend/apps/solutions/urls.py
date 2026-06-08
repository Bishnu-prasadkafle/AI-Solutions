from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PastSolutionViewSet

router = DefaultRouter()
router.register(r'', PastSolutionViewSet, basename='solution')

urlpatterns = [
    path('', include(router.urls)),
]
