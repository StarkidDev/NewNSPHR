"""
Models for communications, complaints, and messaging system.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.core.models import TimeStampedModel

User = get_user_model()


class Complaint(TimeStampedModel):
    """
    Complaint system for NSPs to file complaints digitally.
    """
    
    COMPLAINT_TYPE_CHOICES = [
        ('HARASSMENT', 'Harassment'),
        ('DISCRIMINATION', 'Discrimination'),
        ('WORKPLACE_SAFETY', 'Workplace Safety'),
        ('UNFAIR_TREATMENT', 'Unfair Treatment'),
        ('RESOURCE_INADEQUACY', 'Inadequate Resources'),
        ('SUPERVISION_ISSUES', 'Supervision Issues'),
        ('ACCOMMODATION', 'Accommodation Issues'),
        ('TRANSPORTATION', 'Transportation Issues'),
        ('ALLOWANCE', 'Allowance Related'),
        ('OTHER', 'Other'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('ACKNOWLEDGED', 'Acknowledged'),
        ('UNDER_INVESTIGATION', 'Under Investigation'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
        ('ESCALATED', 'Escalated'),
    ]
    
    # Complainant Information
    complainant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='filed_complaints',
        limit_choices_to={'user_type': 'NSP'}
    )
    
    # Complaint Details
    complaint_type = models.CharField(max_length=20, choices=COMPLAINT_TYPE_CHOICES)
    subject = models.CharField(max_length=200)
    description = models.TextField(help_text="Detailed description of the complaint")
    incident_date = models.DateField(help_text="Date when the incident occurred")
    location = models.CharField(max_length=200, help_text="Location where incident occurred")
    
    # People Involved
    people_involved = models.TextField(
        blank=True,
        help_text="Names and roles of people involved"
    )
    witnesses = models.TextField(
        blank=True,
        help_text="Names and contact details of witnesses"
    )
    
    # Priority and Classification
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    is_anonymous = models.BooleanField(default=False)
    
    # Supporting Evidence
    supporting_documents = models.FileField(
        upload_to='complaints/%Y/%m/',
        blank=True,
        null=True,
        help_text="Supporting documents, photos, or evidence"
    )
    
    # Status and Processing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUBMITTED')
    complaint_number = models.CharField(max_length=50, unique=True, blank=True)
    
    # Assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_complaints',
        limit_choices_to={'user_type__in': ['HR', 'ADMIN']}
    )
    assigned_at = models.DateTimeField(blank=True, null=True)
    
    # Resolution
    resolution_notes = models.TextField(blank=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_complaints'
    )
    
    # Follow-up
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Complaint"
        verbose_name_plural = "Complaints"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['complainant', 'status']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['priority', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.complaint_number} - {self.subject}"
    
    def save(self, *args, **kwargs):
        if not self.complaint_number:
            year = timezone.now().year
            count = Complaint.objects.filter(
                created_at__year=year
            ).count() + 1
            self.complaint_number = f"COMP/{year}/{count:04d}"
        super().save(*args, **kwargs)
    
    def assign_to(self, user):
        """Assign complaint to a user."""
        self.assigned_to = user
        self.assigned_at = timezone.now()
        self.status = 'ACKNOWLEDGED'
        self.save()
    
    def resolve(self, resolved_by, notes=""):
        """Mark complaint as resolved."""
        self.status = 'RESOLVED'
        self.resolved_by = resolved_by
        self.resolved_at = timezone.now()
        self.resolution_notes = notes
        self.save()


class ComplaintResponse(TimeStampedModel):
    """
    Responses and updates to complaints.
    """
    
    RESPONSE_TYPE_CHOICES = [
        ('ACKNOWLEDGMENT', 'Acknowledgment'),
        ('UPDATE', 'Status Update'),
        ('CLARIFICATION', 'Clarification Request'),
        ('RESOLUTION', 'Resolution'),
        ('FOLLOW_UP', 'Follow-up'),
    ]
    
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    
    responder = models.ForeignKey(User, on_delete=models.CASCADE)
    response_type = models.CharField(max_length=20, choices=RESPONSE_TYPE_CHOICES)
    message = models.TextField()
    
    # Attachments
    attachments = models.FileField(
        upload_to='complaint_responses/%Y/%m/',
        blank=True,
        null=True
    )
    
    # Visibility
    is_internal = models.BooleanField(
        default=False,
        help_text="Internal notes not visible to complainant"
    )
    
    class Meta:
        verbose_name = "Complaint Response"
        verbose_name_plural = "Complaint Responses"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Response to {self.complaint.complaint_number} by {self.responder.get_full_name()}"


class Message(TimeStampedModel):
    """
    Internal messaging system for users.
    """
    
    MESSAGE_TYPE_CHOICES = [
        ('DIRECT', 'Direct Message'),
        ('BROADCAST', 'Broadcast Message'),
        ('SYSTEM', 'System Message'),
        ('REMINDER', 'Reminder'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('NORMAL', 'Normal'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    # Message Information
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    recipients = models.ManyToManyField(
        User,
        related_name='received_messages',
        through='MessageRecipient'
    )
    
    # Message Content
    subject = models.CharField(max_length=200)
    body = models.TextField()
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPE_CHOICES, default='DIRECT')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='NORMAL')
    
    # Attachments
    attachments = models.FileField(
        upload_to='messages/%Y/%m/',
        blank=True,
        null=True
    )
    
    # Scheduling
    scheduled_send = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Schedule message to be sent later"
    )
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    
    # Threading
    parent_message = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sender', '-created_at']),
            models.Index(fields=['message_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.subject} - from {self.sender.get_full_name()}"
    
    def send(self):
        """Mark message as sent."""
        self.is_sent = True
        self.sent_at = timezone.now()
        self.save()


class MessageRecipient(TimeStampedModel):
    """
    Through model for message recipients with read status.
    """
    
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Read Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    
    # Actions
    is_starred = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Message Recipient"
        verbose_name_plural = "Message Recipients"
        unique_together = ['message', 'recipient']
    
    def mark_as_read(self):
        """Mark message as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class Feedback(TimeStampedModel):
    """
    General feedback system for continuous improvement.
    """
    
    FEEDBACK_TYPE_CHOICES = [
        ('SUGGESTION', 'Suggestion'),
        ('PRAISE', 'Praise'),
        ('CONCERN', 'Concern'),
        ('BUG_REPORT', 'Bug Report'),
        ('FEATURE_REQUEST', 'Feature Request'),
        ('GENERAL', 'General Feedback'),
    ]
    
    CATEGORY_CHOICES = [
        ('PORTAL', 'NSP Portal System'),
        ('PROCESS', 'Business Process'),
        ('SERVICE', 'Service Quality'),
        ('FACILITY', 'Facilities'),
        ('STAFF', 'Staff/Personnel'),
        ('OTHER', 'Other'),
    ]
    
    # Feedback Information
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='feedback_submissions'
    )
    
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Rating (for service feedback)
    rating = models.PositiveIntegerField(
        blank=True,
        null=True,
        choices=[(i, i) for i in range(1, 6)],
        help_text="Rating from 1-5 stars"
    )
    
    # Anonymity
    is_anonymous = models.BooleanField(default=False)
    
    # Response
    response = models.TextField(blank=True)
    responded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedback_responses'
    )
    responded_at = models.DateTimeField(blank=True, null=True)
    
    # Status
    is_acknowledged = models.BooleanField(default=False)
    is_implemented = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Feedback"
        verbose_name_plural = "Feedback"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_feedback_type_display()} - {self.title}"
    
    def acknowledge(self):
        """Acknowledge the feedback."""
        self.is_acknowledged = True
        self.save()
    
    def respond(self, responder, response_text):
        """Respond to the feedback."""
        self.response = response_text
        self.responded_by = responder
        self.responded_at = timezone.now()
        self.is_acknowledged = True
        self.save()


class CommunicationLog(TimeStampedModel):
    """
    Log all communications for audit and tracking purposes.
    """
    
    COMMUNICATION_TYPE_CHOICES = [
        ('EMAIL', 'Email'),
        ('SMS', 'SMS'),
        ('SYSTEM_MESSAGE', 'System Message'),
        ('ANNOUNCEMENT', 'Announcement'),
        ('COMPLAINT', 'Complaint'),
        ('FEEDBACK', 'Feedback'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    communication_type = models.CharField(max_length=20, choices=COMMUNICATION_TYPE_CHOICES)
    subject = models.CharField(max_length=200)
    content = models.TextField()
    
    # Recipients
    recipients = models.TextField(help_text="Comma-separated list of recipients")
    
    # Status
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True)
    
    # Related Objects
    related_object_type = models.CharField(max_length=50, blank=True)
    related_object_id = models.PositiveIntegerField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Communication Log"
        verbose_name_plural = "Communication Logs"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['communication_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_communication_type_display()} - {self.subject}"