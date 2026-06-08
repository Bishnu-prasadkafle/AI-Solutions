from django.db import models
from django.contrib.auth.models import User


class Blog(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]
    CATEGORY_CHOICES = [
        ('ai', 'Artificial Intelligence'),
        ('tech', 'Technology'),
        ('news', 'Company News'),
        ('tutorial', 'Tutorial'),
        ('case_study', 'Case Study'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()
    cover_image = models.ImageField(upload_to='blogs/', blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='tech')
    tags = models.JSONField(default=list, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    read_time = models.PositiveIntegerField(default=5, help_text='Estimated read time in minutes')
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
