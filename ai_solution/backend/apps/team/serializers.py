from rest_framework import serializers
from .models import TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        from django.conf import settings
        import os
        base = os.getenv('BACKEND_URL', 'http://localhost:8000')
        return f"{base}{obj.image.url}"
