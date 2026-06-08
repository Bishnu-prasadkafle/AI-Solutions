from django.db import models


class Feedback(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    company = models.CharField(max_length=200, blank=True)
    avatar = models.ImageField(upload_to='feedback/avatars/', blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=5)  # 1-5
    message = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.rating}★"
