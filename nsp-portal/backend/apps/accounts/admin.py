"""
Django admin configuration for accounts app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, NSPProfile, HRProfile, SupervisorProfile, UserSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom user admin with additional fields."""
    
    list_display = (
        'username', 'email', 'first_name', 'last_name', 
        'user_type', 'is_verified', 'is_active', 'date_joined'
    )
    list_filter = ('user_type', 'is_verified', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'employee_id')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone_number', 'employee_id', 'profile_picture')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verification_token')
        }),
        ('Tracking', {
            'fields': ('last_login_ip',),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone_number', 'employee_id')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


class NSPProfileInline(admin.StackedInline):
    """Inline admin for NSP Profile."""
    model = NSPProfile
    can_delete = False
    verbose_name_plural = 'NSP Profile'
    
    fieldsets = (
        ('NSS Information', {
            'fields': ('nss_id', 'program', 'service_year')
        }),
        ('Personal Information', {
            'fields': (
                'date_of_birth', 'gender', 'residential_address',
                'emergency_contact_name', 'emergency_contact_phone'
            )
        }),
        ('Educational Background', {
            'fields': ('institution_attended', 'qualification', 'course_of_study')
        }),
        ('Service Details', {
            'fields': (
                'department_assigned', 'supervisor', 'start_date', 
                'expected_end_date', 'actual_end_date', 'status'
            )
        }),
        ('Documents', {
            'fields': ('nss_appointment_letter', 'gnpc_appointment_letter'),
            'classes': ('collapse',)
        }),
    )


@admin.register(NSPProfile)
class NSPProfileAdmin(admin.ModelAdmin):
    """NSP Profile admin."""
    
    list_display = (
        'user', 'nss_id', 'program', 'service_year', 
        'department_assigned', 'supervisor', 'status'
    )
    list_filter = ('program', 'service_year', 'status', 'department_assigned')
    search_fields = ('user__username', 'user__email', 'nss_id', 'user__first_name', 'user__last_name')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('NSS Information', {
            'fields': ('nss_id', 'program', 'service_year')
        }),
        ('Personal Information', {
            'fields': (
                'date_of_birth', 'gender', 'residential_address',
                'emergency_contact_name', 'emergency_contact_phone'
            )
        }),
        ('Educational Background', {
            'fields': ('institution_attended', 'qualification', 'course_of_study')
        }),
        ('Service Details', {
            'fields': (
                'department_assigned', 'supervisor', 'start_date', 
                'expected_end_date', 'actual_end_date', 'status'
            )
        }),
        ('Documents', {
            'fields': ('nss_appointment_letter', 'gnpc_appointment_letter'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'supervisor')


@admin.register(HRProfile)
class HRProfileAdmin(admin.ModelAdmin):
    """HR Profile admin."""
    
    list_display = ('user', 'department', 'position', 'hire_date')
    list_filter = ('department', 'hire_date')
    search_fields = ('user__username', 'user__email', 'department', 'position')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Work Information', {
            'fields': ('department', 'position', 'hire_date')
        }),
        ('Permissions', {
            'fields': ('can_approve_appointments', 'can_manage_permissions', 'can_view_reports')
        }),
    )


@admin.register(SupervisorProfile)
class SupervisorProfileAdmin(admin.ModelAdmin):
    """Supervisor Profile admin."""
    
    list_display = ('user', 'department', 'position', 'current_nsp_count', 'max_nsps_to_supervise')
    list_filter = ('department', 'hire_date')
    search_fields = ('user__username', 'user__email', 'department', 'position')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Work Information', {
            'fields': ('department', 'position', 'hire_date')
        }),
        ('Supervision Details', {
            'fields': ('max_nsps_to_supervise',)
        }),
    )
    
    def current_nsp_count(self, obj):
        """Display current NSP count."""
        return obj.current_nsp_count
    current_nsp_count.short_description = 'Current NSPs'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """User Session admin."""
    
    list_display = ('user', 'ip_address', 'login_time', 'last_activity', 'is_active')
    list_filter = ('is_active', 'login_time', 'last_activity')
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('session_key', 'login_time', 'last_activity')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
    
    def has_add_permission(self, request):
        return False