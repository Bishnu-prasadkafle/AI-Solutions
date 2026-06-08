from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import GalleryItem
from .serializers import GalleryItemSerializer


class GalleryViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'is_featured', 'is_upcoming']

    def get_queryset(self):
        qs = GalleryItem.objects.all()
        upcoming = self.request.query_params.get('upcoming')
        past = self.request.query_params.get('past')
        if upcoming == 'true':
            qs = qs.filter(type='event', is_upcoming=True)
        elif past == 'true':
            qs = qs.filter(type='event', is_upcoming=False)
        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]
