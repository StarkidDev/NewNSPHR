"""
Models for NSP appointment submission and approval workflow.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from apps.core.models import TimeStampedModel

User = get_user_model()


class AppointmentSubmission(TimeStampedModel):
    """
    Model for NSP appointment letter submissions (before user account creation).
    """
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('DECLINED', 'Declined'),
        ('REQUIRES_INFO', 'Requires Additional Information'),
    ]
    
    PROGRAM_CHOICES = [
        ('REGULAR', 'Regular National Service'),
        ('TEACHERS', 'Teachers National Service'),
        ('HEALTH', 'Health National Service'),
        ('GRADUATE', 'Graduate National Service'),
    ]
    
    # Personal Information (collected without login)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    nss_id = models.CharField(max_length=50, unique=True)
    
    # Program Information
    program = models.CharField(max_length=20, choices=PROGRAM_CHOICES)
    service_year = models.PositiveIntegerField()
    institution_attended = models.CharField(max_length=200)
    qualification = models.CharField(max_length=100)
    course_of_study = models.CharField(max_length=100)
    
    # Document Upload
    nss_appointment_letter = models.FileField(
        upload_to='nss_submissions/%Y/%m/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])]
    )
    
    # Submission Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submission_reference = models.CharField(max_length=50, unique=True, blank=True)
    
    # Review Information
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_submissions',
        limit_choices_to={'user_type': 'HR'}
    )
    reviewed_at = models.DateTimeField(blank=True, null=True)
    review_notes = models.TextField(blank=True)
    
    # Approval/Rejection
    decision_date = models.DateTimeField(blank=True, null=True)
    decision_notes = models.TextField(blank=True)
    
    # User Account (created after approval)
    created_user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointment_submission'
    )
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        verbose_name = "Appointment Submission"
        verbose_name_plural = "Appointment Submissions"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['email']),
            models.Index(fields=['nss_id']),
        ]
    
    def __str__(self):
        return f"{self.full_name} - {self.nss_id} ({self.get_status_display()})"
    
    def save(self, *args, **kwargs):
        if not self.submission_reference:
            import uuid
            self.submission_reference = f"NSP{timezone.now().year}{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    @property
    def is_pending(self):
        return self.status == 'PENDING'
    
    @property
    def is_approved(self):
        return self.status == 'APPROVED'
    
    @property
    def is_declined(self):
        return self.status == 'DECLINED'
    
    def approve(self, reviewed_by, notes=""):
        """Approve the submission."""
        self.status = 'APPROVED'
        self.reviewed_by = reviewed_by
        self.reviewed_at = timezone.now()
        self.decision_date = timezone.now()
        self.review_notes = notes
        self.save()
    
    def decline(self, reviewed_by, notes=""):
        """Decline the submission."""
        self.status = 'DECLINED'
        self.reviewed_by = reviewed_by
        self.reviewed_at = timezone.now()
        self.decision_date = timezone.now()
        self.review_notes = notes
        self.save()



class AppointmentDocument(TimeStampedModel):
    """
    Additional documents related to appointment process.
    """
    
    DOCUMENT_TYPE_CHOICES = [
        ('VERIFICATION', 'Verification Document'),
        ('AMENDMENT', 'Amendment Letter'),
        ('EXTENSION', 'Service Extension'),
        ('TERMINATION', 'Service Termination'),
        ('CERTIFICATE', 'Completion Certificate'),
    ]
    
    appointment_submission = models.ForeignKey(
        AppointmentSubmission,
        on_delete=models.CASCADE,
        related_name='additional_documents',
        blank=True,
        null=True
    )
    

    
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # File Upload
    document_file = models.FileField(
        upload_to='appointment_docs/%Y/%m/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'])]
    )
    
    # Metadata
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_required = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_appointment_docs'
    )
    verified_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Appointment Document"
        verbose_name_plural = "Appointment Documents"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()})"


class AppointmentStatusHistory(TimeStampedModel):
    """
    Track status changes for appointment submissions.
    """
    
    appointment_submission = models.ForeignKey(
        AppointmentSubmission,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    
    previous_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    change_reason = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Appointment Status History"
        verbose_name_plural = "Appointment Status Histories"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.appointment_submission.full_name}: {self.previous_status} → {self.new_status}"


class AppointmentEmailLog(TimeStampedModel):
    """
    Log emails sent during appointment process.
    """
    
    EMAIL_TYPE_CHOICES = [
        ('CONFIRMATION', 'Submission Confirmation'),
        ('APPROVAL', 'Approval Notification'),
        ('REJECTION', 'Rejection Notification'),
        ('CREDENTIALS', 'Login Credentials'),
        ('REMINDER', 'Reminder Email'),
        ('DOCUMENT_REQUEST', 'Document Request'),
    ]
    
    appointment_submission = models.ForeignKey(
        AppointmentSubmission,
        on_delete=models.CASCADE,
        related_name='email_logs'
    )
    
    email_type = models.CharField(max_length=20, choices=EMAIL_TYPE_CHOICES)
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=200)
    message_body = models.TextField()
    
    # Sending Status
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True)
    
    # Email Service Details
    message_id = models.CharField(max_length=100, blank=True)
    
    class Meta:
        verbose_name = "Appointment Email Log"
        verbose_name_plural = "Appointment Email Logs"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_email_type_display()} - {self.recipient_email}"