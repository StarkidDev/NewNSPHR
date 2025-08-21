"""
User accounts and authentication models for the NSP Portal.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Supports different user types: NSP, HR, Supervisor.
    """
    
    USER_TYPE_CHOICES = [
        ('NSP', 'National Service Personnel'),
        ('HR', 'Human Resources'),
        ('SUPERVISOR', 'Supervisor'),
        ('ADMIN', 'System Administrator'),
    ]
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='NSP'
    )
    
    # Contact Information
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    employee_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    
    # Profile Information
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    
    # Status and Verification
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    def get_full_name(self):
        """Return the full name of the user."""
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    @property
    def is_nsp(self):
        return self.user_type == 'NSP'
    
    @property
    def is_hr(self):
        return self.user_type == 'HR'
    
    @property
    def is_supervisor(self):
        return self.user_type == 'SUPERVISOR'
    
    @property
    def is_admin_user(self):
        return self.user_type == 'ADMIN'


class NSPProfile(models.Model):
    """
    Extended profile information for National Service Personnel.
    """
    
    PROGRAM_CHOICES = [
        ('REGULAR', 'Regular National Service'),
        ('TEACHERS', 'Teachers National Service'),
        ('HEALTH', 'Health National Service'),
        ('GRADUATE', 'Graduate National Service'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('ACTIVE', 'Active Service'),
        ('COMPLETED', 'Service Completed'),
        ('TERMINATED', 'Service Terminated'),
        ('DEFERRED', 'Service Deferred'),
    ]
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='nsp_profile'
    )
    
    # NSS Information
    nss_id = models.CharField(max_length=50, unique=True)
    program = models.CharField(max_length=20, choices=PROGRAM_CHOICES)
    service_year = models.PositiveIntegerField()
    
    # Personal Information
    date_of_birth = models.DateField()
    gender = models.CharField(
        max_length=10,
        choices=[('M', 'Male'), ('F', 'Female')],
        blank=True,
        null=True
    )
    residential_address = models.TextField()
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    
    # Educational Background
    institution_attended = models.CharField(max_length=200)
    qualification = models.CharField(max_length=100)
    course_of_study = models.CharField(max_length=100)
    
    # Service Details
    department_assigned = models.CharField(max_length=100, blank=True, null=True)
    supervisor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='supervised_nsps',
        limit_choices_to={'user_type': 'SUPERVISOR'}
    )
    start_date = models.DateField(blank=True, null=True)
    expected_end_date = models.DateField(blank=True, null=True)
    actual_end_date = models.DateField(blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Documents
    nss_appointment_letter = models.FileField(
        upload_to='nss_letters/',
        blank=True,
        null=True
    )
    gnpc_appointment_letter_file = models.FileField(
        upload_to='gnpc_letters/',
        blank=True,
        null=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "NSP Profile"
        verbose_name_plural = "NSP Profiles"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.nss_id}"
    
    @property
    def is_service_active(self):
        return self.status == 'ACTIVE'
    
    @property
    def service_duration_months(self):
        """Calculate service duration in months."""
        if self.start_date and self.expected_end_date:
            return (self.expected_end_date - self.start_date).days // 30
        return None


class HRProfile(models.Model):
    """
    Profile information for HR personnel.
    """
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='hr_profile'
    )
    
    # Work Information
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    hire_date = models.DateField()
    
    # Permissions
    can_approve_appointments = models.BooleanField(default=True)
    can_manage_permissions = models.BooleanField(default=True)
    can_view_reports = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "HR Profile"
        verbose_name_plural = "HR Profiles"
    
    def __str__(self):
        return f"{self.user.get_full_name()} - HR ({self.department})"


class SupervisorProfile(models.Model):
    """
    Profile information for supervisors.
    """
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='supervisor_profile'
    )
    
    # Work Information
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    hire_date = models.DateField()
    
    # Supervision Details
    max_nsps_to_supervise = models.PositiveIntegerField(default=5)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Supervisor Profile"
        verbose_name_plural = "Supervisor Profiles"
    
    def __str__(self):
        return f"{self.user.get_full_name()} - Supervisor ({self.department})"
    
    @property
    def current_nsp_count(self):
        """Get current number of NSPs under supervision."""
        return self.supervised_nsps.filter(status='ACTIVE').count()
    
    @property
    def can_take_more_nsps(self):
        """Check if supervisor can take more NSPs."""
        return self.current_nsp_count < self.max_nsps_to_supervise


class UserSession(models.Model):
    """
    Track user sessions for security and audit purposes.
    """
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "User Session"
        verbose_name_plural = "User Sessions"
        ordering = ['-login_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.ip_address} ({self.login_time})"