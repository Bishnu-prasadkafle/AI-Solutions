from rest_framework import viewsets, parsers
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_approved', 'rating']
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action in ['create']:
            return [AllowAny()]
        if self.action == 'list':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = Feedback.objects.all()
        if self.action == 'list' and not self.request.user.is_staff:
            qs = qs.filter(is_approved=True)
        return qs

    @action(detail=True, methods=['patch'], url_path='approve')
    def approve(self, request, pk=None):
        feedback = self.get_object()
        feedback.is_approved = not feedback.is_approved
        feedback.save()
        return Response({'is_approved': feedback.is_approved})
