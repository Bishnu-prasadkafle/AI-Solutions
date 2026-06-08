from rest_framework import serializers
from .models import Blog


class BlogSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Blog
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'views']

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url


class BlogListSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Blog
        exclude = ['content']

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url
