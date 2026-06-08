from django.db import models


class Contact(models.Model):
    INTEREST_CHOICES = [
        ('virtual_assistant', 'AI-Powered Virtual Assistant'),
        ('schedule_demo', 'Schedule a Demo'),
        ('events', 'Promotional Events'),
        ('sales', 'Chat with Sales'),
        ('general', 'General Inquiry'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company_name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    job_title = models.CharField(max_length=200, blank=True)
    interest = models.CharField(max_length=50, choices=INTEREST_CHOICES, default='general')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.company_name} ({self.interest})"
