from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import PastSolution
from .serializers import PastSolutionSerializer


class PastSolutionViewSet(viewsets.ModelViewSet):
    queryset = PastSolution.objects.all()
    serializer_class = PastSolutionSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = PastSolution.objects.all()
        if self.action == 'list' and not self.request.user.is_staff:
            qs = qs.filter(is_active=True)
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs
