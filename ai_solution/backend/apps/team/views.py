from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import TeamMember
from .serializers import TeamMemberSerializer


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = TeamMember.objects.all()
        if self.action == 'list' and not self.request.user.is_staff:
            qs = qs.filter(is_active=True)
        return qs
