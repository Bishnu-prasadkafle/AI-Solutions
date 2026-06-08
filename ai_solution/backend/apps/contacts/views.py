from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_read', 'interest']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        contact = serializer.save()
        try:
            # Email to user - confirmation
            send_mail(
                subject='Your Enquiry Has Been Submitted – AI Solutions',
                message=(
                    f"Hi {contact.name},\n\n"
                    "Thank you for reaching out to AI Solutions!\n"
                    "Your enquiry has been submitted successfully.\n"
                    "Our team will contact you within 24–48 hours.\n\n"
                    f"Your Message:\n{contact.message}\n\n"
                    "Best regards,\nAI Solutions Team"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact.email],
                fail_silently=False,
            )
            print(f"[EMAIL] Confirmation sent to {contact.email}")

            # Email to business - new inquiry notification
            send_mail(
                subject=f'New Contact Inquiry from {contact.name}',
                message=(
                    f"New inquiry received:\n\n"
                    f"Name: {contact.name}\n"
                    f"Email: {contact.email}\n"
                    f"Phone: {contact.phone}\n"
                    f"Company: {contact.company_name}\n"
                    f"Country: {contact.country}\n"
                    f"Job Title: {contact.job_title}\n"
                    f"Interest: {contact.get_interest_display()}\n"
                    f"Message:\n{contact.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=False,
            )
            print(f"[EMAIL] Inquiry notification sent to business email")
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        contact = self.get_object()
        contact.is_read = True
        contact.save()
        return Response({'status': 'marked as read'})
