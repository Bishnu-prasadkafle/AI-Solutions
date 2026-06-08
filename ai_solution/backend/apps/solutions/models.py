from django.db import models


class PastSolution(models.Model):
    STATUS_CHOICES = [
        ('deployed', 'Deployed'),
        ('in_development', 'In Development'),
        ('ready_to_launch', 'Ready to Launch'),
    ]

    title = models.CharField(max_length=200)
    industry = models.CharField(max_length=150)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='solutions/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='deployed')
    year = models.PositiveIntegerField(blank=True, null=True)
    technologies = models.JSONField(default=list, blank=True, help_text='List of tech/stack strings')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.industry})"
