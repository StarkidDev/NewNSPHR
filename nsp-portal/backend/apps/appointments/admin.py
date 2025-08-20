"""
Django admin configuration for appointments app.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    AppointmentSubmission, GNPCAppointmentLetter, AppointmentDocument,
    AppointmentStatusHistory, AppointmentEmailLog
)


@admin.register(AppointmentSubmission)
class AppointmentSubmissionAdmin(admin.ModelAdmin):
    """Admin for appointment submissions."""
    
    list_display = (
        'full_name', 'email', 'nss_id', 'program', 
        'status', 'submission_reference', 'created_at'
    )
    list_filter = ('status', 'program', 'service_year', 'created_at')
    search_fields = ('full_name', 'email', 'nss_id', 'submission_reference')
    readonly_fields = ('submission_reference', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone_number', 'nss_id')
        }),
        ('Program Information', {
            'fields': ('program', 'service_year', 'institution_attended', 'qualification', 'course_of_study')
        }),
        ('Document', {
            'fields': ('nss_appointment_letter',)
        }),
        ('Status', {
            'fields': ('status', 'submission_reference')
        }),
        ('Review Information', {
            'fields': ('reviewed_by', 'reviewed_at', 'review_notes'),
            'classes': ('collapse',)
        }),
        ('Decision', {
            'fields': ('decision_date', 'decision_notes'),
            'classes': ('collapse',)
        }),
        ('User Account', {
            'fields': ('created_user',),
            'classes': ('collapse',)
        }),
        ('Verification', {
            'fields': ('is_verified', 'verification_token'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_submissions', 'decline_submissions']
    
    def approve_submissions(self, request, queryset):
        """Bulk approve submissions."""
        updated = 0
        for submission in queryset.filter(status='PENDING'):
            submission.approve(request.user, "Bulk approved via admin")
            updated += 1
        
        self.message_user(request, f'{updated} submissions approved.')
    approve_submissions.short_description = "Approve selected submissions"
    
    def decline_submissions(self, request, queryset):
        """Bulk decline submissions."""
        updated = 0
        for submission in queryset.filter(status='PENDING'):
            submission.decline(request.user, "Bulk declined via admin")
            updated += 1
        
        self.message_user(request, f'{updated} submissions declined.')
    decline_submissions.short_description = "Decline selected submissions"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('reviewed_by', 'created_user')


class AppointmentDocumentInline(admin.TabularInline):
    """Inline admin for appointment documents."""
    model = AppointmentDocument
    extra = 0
    fields = ('document_type', 'title', 'document_file', 'is_required', 'is_verified')
    readonly_fields = ('uploaded_by',)


@admin.register(GNPCAppointmentLetter)
class GNPCAppointmentLetterAdmin(admin.ModelAdmin):
    """Admin for GNPC appointment letters."""
    
    list_display = (
        'letter_number', 'nsp_profile', 'department_assigned', 
        'issue_date', 'is_issued', 'is_acknowledged'
    )
    list_filter = ('is_issued', 'is_acknowledged', 'issue_date', 'department_assigned')
    search_fields = ('letter_number', 'nsp_profile__user__username', 'nsp_profile__nss_id')
    readonly_fields = ('letter_number', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Letter Information', {
            'fields': ('letter_number', 'nsp_profile', 'issue_date')
        }),
        ('Assignment Details', {
            'fields': ('reporting_date', 'department_assigned', 'supervisor_assigned')
        }),
        ('Service Period', {
            'fields': ('service_start_date', 'service_end_date')
        }),
        ('Letter Content', {
            'fields': ('letter_content',),
            'classes': ('collapse',)
        }),
        ('Digital Signature', {
            'fields': ('signed_by', 'signed_at', 'digital_signature'),
            'classes': ('collapse',)
        }),
        ('Documents', {
            'fields': ('pdf_letter',)
        }),
        ('Status', {
            'fields': ('is_issued', 'is_acknowledged', 'acknowledged_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [AppointmentDocumentInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'nsp_profile__user', 'supervisor_assigned', 'signed_by'
        )


@admin.register(AppointmentDocument)
class AppointmentDocumentAdmin(admin.ModelAdmin):
    """Admin for appointment documents."""
    
    list_display = ('title', 'document_type', 'uploaded_by', 'is_verified', 'created_at')
    list_filter = ('document_type', 'is_verified', 'is_required', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Document Information', {
            'fields': ('title', 'description', 'document_type')
        }),
        ('File', {
            'fields': ('document_file',)
        }),
        ('Related Objects', {
            'fields': ('appointment_submission', 'gnpc_letter')
        }),
        ('Status', {
            'fields': ('uploaded_by', 'is_required', 'is_verified', 'verified_by', 'verified_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('uploaded_by', 'verified_by')


@admin.register(AppointmentStatusHistory)
class AppointmentStatusHistoryAdmin(admin.ModelAdmin):
    """Admin for appointment status history."""
    
    list_display = ('appointment_submission', 'previous_status', 'new_status', 'changed_by', 'created_at')
    list_filter = ('new_status', 'previous_status', 'created_at')
    search_fields = ('appointment_submission__full_name', 'appointment_submission__nss_id')
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('appointment_submission', 'changed_by')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(AppointmentEmailLog)
class AppointmentEmailLogAdmin(admin.ModelAdmin):
    """Admin for appointment email logs."""
    
    list_display = ('appointment_submission', 'email_type', 'recipient_email', 'is_sent', 'sent_at')
    list_filter = ('email_type', 'is_sent', 'sent_at')
    search_fields = ('appointment_submission__full_name', 'recipient_email', 'subject')
    readonly_fields = ('created_at', 'updated_at', 'sent_at')
    
    fieldsets = (
        ('Email Information', {
            'fields': ('appointment_submission', 'email_type', 'recipient_email')
        }),
        ('Content', {
            'fields': ('subject', 'message_body')
        }),
        ('Status', {
            'fields': ('is_sent', 'sent_at', 'error_message', 'message_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('appointment_submission')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False