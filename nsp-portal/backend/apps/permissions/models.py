"""
Models for digital permission and off-duty request system.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator
from apps.core.models import TimeStampedModel

User = get_user_model()


class PermissionRequest(TimeStampedModel):
    """
    Digital permission/off-duty request model based on GNPC official form.
    """
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('SUPERVISOR_APPROVED', 'Approved by Supervisor'),
        ('HR_REVIEW', 'Under HR Review'),
        ('APPROVED', 'Approved'),
        ('DECLINED', 'Declined'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    PERMISSION_TYPE_CHOICES = [
        ('SICK_LEAVE', 'Sick Leave'),
        ('EMERGENCY_LEAVE', 'Emergency Leave'),
        ('PERSONAL_LEAVE', 'Personal Leave'),
        ('MEDICAL_APPOINTMENT', 'Medical Appointment'),
        ('FAMILY_EMERGENCY', 'Family Emergency'),
        ('ACADEMIC_RELATED', 'Academic Related'),
        ('OFFICIAL_DUTY', 'Official Duty'),
        ('OTHER', 'Other'),
    ]
    
    # Request Information
    nsp = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='permission_requests',
        limit_choices_to={'user_type': 'NSP'}
    )
    
    # Permission Details
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    days_requested = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Number of days requested"
    )
    reason = models.TextField(help_text="Detailed reason for permission request")
    
    # Contact Information
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()
    residential_address = models.TextField()
    
    # Supervisor Information (auto-filled)
    supervisor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='supervised_permission_requests',
        limit_choices_to={'user_type': 'SUPERVISOR'}
    )
    
    # Supervisor Endorsement
    supervisor_endorsed = models.BooleanField(default=False)
    supervisor_endorsed_at = models.DateTimeField(blank=True, null=True)
    supervisor_comments = models.TextField(blank=True)
    
    # HR Decision
    days_granted = models.PositiveIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        help_text="Number of days granted by HR"
    )
    granted_start_date = models.DateField(blank=True, null=True)
    granted_end_date = models.DateField(blank=True, null=True)
    resumption_date = models.DateField(blank=True, null=True)
    
    # Status and Verification
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    hr_officer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_permission_requests',
        limit_choices_to={'user_type': 'HR'}
    )
    hr_decision_date = models.DateTimeField(blank=True, null=True)
    hr_comments = models.TextField(blank=True)
    
    # Supporting Documents
    supporting_document = models.FileField(
        upload_to='permission_documents/%Y/%m/',
        blank=True,
        null=True,
        help_text="Medical certificate, invitation letter, etc."
    )
    
    # Reference Number
    reference_number = models.CharField(max_length=50, unique=True, blank=True)
    
    # Tracking
    is_emergency = models.BooleanField(default=False)
    is_retroactive = models.BooleanField(
        default=False,
        help_text="Request submitted after the fact"
    )
    
    class Meta:
        verbose_name = "Permission Request"
        verbose_name_plural = "Permission Requests"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['nsp', 'status', '-created_at']),
            models.Index(fields=['supervisor', 'status']),
            models.Index(fields=['status', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.nsp.get_full_name()} - {self.get_permission_type_display()} ({self.reference_number})"
    
    def save(self, *args, **kwargs):
        # Generate reference number
        if not self.reference_number:
            year = timezone.now().year
            count = PermissionRequest.objects.filter(
                created_at__year=year
            ).count() + 1
            self.reference_number = f"PERM/{year}/{count:04d}"
        
        # Auto-calculate days if dates are provided
        if self.start_date and self.end_date and not self.days_requested:
            self.days_requested = (self.end_date - self.start_date).days + 1
        
        # Set supervisor from NSP profile
        if not self.supervisor and hasattr(self.nsp, 'nsp_profile'):
            self.supervisor = self.nsp.nsp_profile.supervisor
        
        super().save(*args, **kwargs)
    
    def supervisor_approve(self, comments=""):
        """Supervisor approves the request."""
        self.supervisor_endorsed = True
        self.supervisor_endorsed_at = timezone.now()
        self.supervisor_comments = comments
        self.status = 'SUPERVISOR_APPROVED'
        self.save()
    
    def hr_approve(self, hr_officer, days_granted, start_date, end_date, resumption_date, comments=""):
        """HR approves the request."""
        self.hr_officer = hr_officer
        self.days_granted = days_granted
        self.granted_start_date = start_date
        self.granted_end_date = end_date
        self.resumption_date = resumption_date
        self.hr_comments = comments
        self.status = 'APPROVED'
        self.hr_decision_date = timezone.now()
        self.save()
    
    def decline(self, declined_by, comments=""):
        """Decline the permission request."""
        if declined_by.user_type == 'HR':
            self.hr_officer = declined_by
            self.hr_comments = comments
            self.hr_decision_date = timezone.now()
        else:
            self.supervisor_comments = comments
            self.supervisor_endorsed_at = timezone.now()
        
        self.status = 'DECLINED'
        self.save()
    
    @property
    def is_pending(self):
        return self.status == 'PENDING'
    
    @property
    def is_approved(self):
        return self.status == 'APPROVED'
    
    @property
    def is_declined(self):
        return self.status == 'DECLINED'
    
    @property
    def is_active(self):
        """Check if permission is currently active."""
        if not self.is_approved:
            return False
        
        today = timezone.now().date()
        if self.granted_start_date and self.granted_end_date:
            return self.granted_start_date <= today <= self.granted_end_date
        return False
    
    @property
    def days_remaining(self):
        """Calculate remaining days of approved permission."""
        if not self.is_approved or not self.granted_end_date:
            return 0
        
        today = timezone.now().date()
        if today > self.granted_end_date:
            return 0
        
        return (self.granted_end_date - today).days + 1


class PermissionStatusHistory(TimeStampedModel):
    """
    Track status changes for permission requests.
    """
    
    permission_request = models.ForeignKey(
        PermissionRequest,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    
    previous_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    change_reason = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Permission Status History"
        verbose_name_plural = "Permission Status Histories"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.permission_request.reference_number}: {self.previous_status} → {self.new_status}"


class PermissionTemplate(TimeStampedModel):
    """
    Pre-defined permission request templates for common scenarios.
    """
    
    name = models.CharField(max_length=100)
    permission_type = models.CharField(max_length=20, choices=PermissionRequest.PERMISSION_TYPE_CHOICES)
    default_reason = models.TextField()
    default_duration_days = models.PositiveIntegerField()
    requires_document = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Auto-approval settings
    auto_approve_if_days_less_than = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Auto-approve if request is for less than this many days"
    )
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Permission Template"
        verbose_name_plural = "Permission Templates"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.get_permission_type_display()})"


class PermissionCalendar(TimeStampedModel):
    """
    Calendar view of all approved permissions for scheduling purposes.
    """
    
    permission_request = models.OneToOneField(
        PermissionRequest,
        on_delete=models.CASCADE,
        related_name='calendar_entry'
    )
    
    # Calendar specific fields
    all_day = models.BooleanField(default=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    
    # Visual styling
    color = models.CharField(max_length=7, default='#3788d8')  # Hex color
    
    # Notifications
    remind_before_days = models.PositiveIntegerField(default=1)
    reminder_sent = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Permission Calendar Entry"
        verbose_name_plural = "Permission Calendar Entries"
    
    def __str__(self):
        return f"Calendar: {self.permission_request.reference_number}"


class PermissionEmailNotification(TimeStampedModel):
    """
    Email notifications for permission requests.
    """
    
    NOTIFICATION_TYPE_CHOICES = [
        ('SUBMITTED', 'Request Submitted'),
        ('SUPERVISOR_APPROVED', 'Supervisor Approved'),
        ('HR_APPROVED', 'HR Approved'),
        ('DECLINED', 'Request Declined'),
        ('REMINDER', 'Reminder'),
        ('RESUMPTION', 'Resumption Reminder'),
    ]
    
    permission_request = models.ForeignKey(
        PermissionRequest,
        on_delete=models.CASCADE,
        related_name='email_notifications'
    )
    
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=200)
    message_body = models.TextField()
    
    # Sending Status
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Permission Email Notification"
        verbose_name_plural = "Permission Email Notifications"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.recipient_email}"


class PermissionStatistics(TimeStampedModel):
    """
    Statistical data for permission requests (monthly/yearly aggregates).
    """
    
    # Time period
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField(blank=True, null=True)  # None for yearly stats
    
    # Department or user-specific stats
    department = models.CharField(max_length=100, blank=True)
    nsp = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    
    # Statistics
    total_requests = models.PositiveIntegerField(default=0)
    approved_requests = models.PositiveIntegerField(default=0)
    declined_requests = models.PositiveIntegerField(default=0)
    pending_requests = models.PositiveIntegerField(default=0)
    
    total_days_requested = models.PositiveIntegerField(default=0)
    total_days_granted = models.PositiveIntegerField(default=0)
    
    # Average processing time (in hours)
    avg_processing_time_hours = models.FloatField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Permission Statistics"
        verbose_name_plural = "Permission Statistics"
        unique_together = ['year', 'month', 'department', 'nsp']
        ordering = ['-year', '-month']
    
    def __str__(self):
        period = f"{self.year}-{self.month:02d}" if self.month else str(self.year)
        context = self.department or (self.nsp.get_full_name() if self.nsp else "Overall")
        return f"Stats {period} - {context}"