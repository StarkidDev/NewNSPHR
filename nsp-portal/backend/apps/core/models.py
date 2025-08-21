"""
Core models shared across the NSP Portal application.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class TimeStampedModel(models.Model):
    """
    Abstract base model that provides self-updating 'created_at' and 'updated_at' fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class Department(TimeStampedModel):
    """
    GNPC departments where NSPs can be assigned.
    """
    
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    head_of_department = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    @property
    def active_nsps_count(self):
        """Get count of active NSPs in this department."""
        return self.nsp_profiles.filter(status='ACTIVE').count()


class Announcement(TimeStampedModel):
    """
    System announcements for all users or specific user types.
    """
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    TARGET_AUDIENCE_CHOICES = [
        ('ALL', 'All Users'),
        ('NSP', 'NSPs Only'),
        ('HR', 'HR Only'),
        ('SUPERVISOR', 'Supervisors Only'),
        ('ADMIN', 'Administrators Only'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    target_audience = models.CharField(max_length=20, choices=TARGET_AUDIENCE_CHOICES, default='ALL')
    
    # Publishing
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements')
    is_published = models.BooleanField(default=False)
    publish_date = models.DateTimeField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    
    # Attachments
    attachment = models.FileField(upload_to='announcements/', blank=True, null=True)
    
    class Meta:
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"
        ordering = ['-publish_date', '-priority']
    
    def __str__(self):
        return f"{self.title} ({self.get_priority_display()})"
    
    def save(self, *args, **kwargs):
        if self.is_published and not self.publish_date:
            self.publish_date = timezone.now()
        super().save(*args, **kwargs)
    
    @property
    def is_active(self):
        """Check if announcement is currently active."""
        now = timezone.now()
        if not self.is_published:
            return False
        if self.publish_date and self.publish_date > now:
            return False
        if self.expiry_date and self.expiry_date < now:
            return False
        return True


class Document(TimeStampedModel):
    """
    Document storage model for various file types.
    """
    
    DOCUMENT_TYPE_CHOICES = [
        ('NSS_LETTER', 'NSS Appointment Letter'),
        ('GNPC_LETTER', 'GNPC Appointment Letter'),
        ('PERMISSION_FORM', 'Permission Request Form'),
        ('MONTHLY_REPORT', 'Monthly Report'),
        ('EVALUATION', 'Performance Evaluation'),
        ('COMPLAINT', 'Complaint Document'),
        ('POLICY', 'Policy Document'),
        ('OTHER', 'Other Document'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to='documents/%Y/%m/')
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    
    # Ownership and Access
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_documents')
    is_public = models.BooleanField(default=False)
    allowed_user_types = models.JSONField(default=list, blank=True)
    
    # Metadata
    version = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.get_document_type_display()})"
    
    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class ActivityLog(TimeStampedModel):
    """
    Log user activities for audit and security purposes.
    """
    
    ACTION_CHOICES = [
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('CREATE', 'Create Record'),
        ('UPDATE', 'Update Record'),
        ('DELETE', 'Delete Record'),
        ('VIEW', 'View Record'),
        ('DOWNLOAD', 'Download File'),
        ('UPLOAD', 'Upload File'),
        ('APPROVE', 'Approve Request'),
        ('REJECT', 'Reject Request'),
        ('SUBMIT', 'Submit Form'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    # Related object information
    content_type = models.CharField(max_length=100, blank=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    object_repr = models.CharField(max_length=200, blank=True)
    
    # Additional metadata
    extra_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        verbose_name = "Activity Log"
        verbose_name_plural = "Activity Logs"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.get_action_display()} ({self.created_at})"


class SystemConfiguration(TimeStampedModel):
    """
    System-wide configuration settings.
    """
    
    CONFIG_TYPE_CHOICES = [
        ('STRING', 'String'),
        ('INTEGER', 'Integer'),
        ('BOOLEAN', 'Boolean'),
        ('JSON', 'JSON'),
    ]
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    config_type = models.CharField(max_length=10, choices=CONFIG_TYPE_CHOICES, default='STRING')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "System Configuration"
        verbose_name_plural = "System Configurations"
        ordering = ['key']
    
    def __str__(self):
        return f"{self.key}: {self.value}"
    
    def get_value(self):
        """Get the typed value based on config_type."""
        if self.config_type == 'INTEGER':
            return int(self.value)
        elif self.config_type == 'BOOLEAN':
            return self.value.lower() in ('true', '1', 'yes', 'on')
        elif self.config_type == 'JSON':
            import json
            return json.loads(self.value)
        return self.value


class Notification(TimeStampedModel):
    """
    In-app notifications for users.
    """
    
    NOTIFICATION_TYPE_CHOICES = [
        ('INFO', 'Information'),
        ('SUCCESS', 'Success'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('REMINDER', 'Reminder'),
    ]
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPE_CHOICES, default='INFO')
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    
    # Related object (optional)
    related_object_type = models.CharField(max_length=100, blank=True)
    related_object_id = models.PositiveIntegerField(blank=True, null=True)
    action_url = models.URLField(blank=True)
    
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.username}"
    
    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])