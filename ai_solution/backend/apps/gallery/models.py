from django.db import models


class GalleryItem(models.Model):
    TYPE_CHOICES = [('event', 'Event'), ('general', 'General')]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='gallery/')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general')
    event_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    organizer = models.CharField(max_length=200, blank=True)
    website_url = models.URLField(blank=True)
    participants_count = models.PositiveIntegerField(null=True, blank=True)
    speakers = models.TextField(blank=True, help_text='One speaker per line: Name, Title')
    guests = models.TextField(blank=True, help_text='One guest per line: Name, Role')
    agenda = models.TextField(blank=True, help_text='One agenda item per line: HH:MM - Description')
    is_featured = models.BooleanField(default=False)
    is_upcoming = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title
