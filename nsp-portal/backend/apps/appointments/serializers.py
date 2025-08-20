"""
Serializers for the appointments app.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    AppointmentSubmission, GNPCAppointmentLetter, AppointmentDocument,
    AppointmentStatusHistory, AppointmentEmailLog
)

User = get_user_model()


class AppointmentSubmissionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating appointment submissions (no login required).
    """
    
    class Meta:
        model = AppointmentSubmission
        fields = [
            'full_name', 'email', 'phone_number', 'nss_id',
            'program', 'service_year', 'institution_attended',
            'qualification', 'course_of_study', 'nss_appointment_letter'
        ]
        
    def validate_email(self, value):
        """Validate email format and uniqueness for pending submissions."""
        if AppointmentSubmission.objects.filter(
            email=value, 
            status__in=['PENDING', 'UNDER_REVIEW', 'APPROVED']
        ).exists():
            raise serializers.ValidationError(
                "An appointment submission with this email already exists."
            )
        return value
    
    def validate_nss_id(self, value):
        """Validate NSS ID uniqueness."""
        if AppointmentSubmission.objects.filter(nss_id=value).exists():
            raise serializers.ValidationError(
                "An appointment submission with this NSS ID already exists."
            )
        return value
    
    def validate_nss_appointment_letter(self, value):
        """Validate file upload."""
        if value:
            # Check file size (10MB limit)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    "File size cannot exceed 10MB."
                )
            
            # Check file extension
            allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png']
            file_extension = value.name.split('.')[-1].lower()
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError(
                    f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
                )
        
        return value


class AppointmentSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing appointment submissions.
    """
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    program_display = serializers.CharField(source='get_program_display', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    
    class Meta:
        model = AppointmentSubmission
        fields = [
            'id', 'full_name', 'email', 'phone_number', 'nss_id',
            'program', 'program_display', 'service_year', 'institution_attended',
            'qualification', 'course_of_study', 'nss_appointment_letter',
            'status', 'status_display', 'submission_reference',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at', 'review_notes',
            'decision_date', 'decision_notes', 'is_verified', 'created_at'
        ]
        read_only_fields = [
            'id', 'submission_reference', 'reviewed_by', 'reviewed_at',
            'review_notes', 'decision_date', 'decision_notes', 'is_verified',
            'created_at'
        ]


class AppointmentSubmissionStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for checking appointment submission status (public endpoint).
    """
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    program_display = serializers.CharField(source='get_program_display', read_only=True)
    
    class Meta:
        model = AppointmentSubmission
        fields = [
            'submission_reference', 'full_name', 'status', 'status_display',
            'program_display', 'created_at', 'reviewed_at', 'decision_date'
        ]


class AppointmentSubmissionReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for HR to review appointment submissions.
    """
    
    class Meta:
        model = AppointmentSubmission
        fields = ['status', 'review_notes', 'decision_notes']
        
    def validate_status(self, value):
        """Validate status transitions."""
        if self.instance:
            current_status = self.instance.status
            valid_transitions = {
                'PENDING': ['UNDER_REVIEW', 'APPROVED', 'DECLINED', 'REQUIRES_INFO'],
                'UNDER_REVIEW': ['APPROVED', 'DECLINED', 'REQUIRES_INFO'],
                'REQUIRES_INFO': ['UNDER_REVIEW', 'APPROVED', 'DECLINED'],
            }
            
            if current_status in valid_transitions:
                if value not in valid_transitions[current_status]:
                    raise serializers.ValidationError(
                        f"Cannot change status from {current_status} to {value}"
                    )
        
        return value


class GNPCAppointmentLetterSerializer(serializers.ModelSerializer):
    """
    Serializer for GNPC appointment letters.
    """
    
    nsp_name = serializers.CharField(source='nsp_profile.user.get_full_name', read_only=True)
    nsp_email = serializers.CharField(source='nsp_profile.user.email', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor_assigned.get_full_name', read_only=True)
    signed_by_name = serializers.CharField(source='signed_by.get_full_name', read_only=True)
    
    class Meta:
        model = GNPCAppointmentLetter
        fields = [
            'id', 'letter_number', 'nsp_profile', 'nsp_name', 'nsp_email',
            'issue_date', 'reporting_date', 'department_assigned',
            'supervisor_assigned', 'supervisor_name', 'service_start_date',
            'service_end_date', 'letter_content', 'signed_by', 'signed_by_name',
            'signed_at', 'pdf_letter', 'is_issued', 'is_acknowledged',
            'acknowledged_at', 'created_at'
        ]
        read_only_fields = [
            'id', 'letter_number', 'signed_at', 'is_acknowledged',
            'acknowledged_at', 'created_at'
        ]


class AppointmentDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for appointment documents.
    """
    
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.get_full_name', read_only=True)
    
    class Meta:
        model = AppointmentDocument
        fields = [
            'id', 'title', 'description', 'document_type', 'document_type_display',
            'document_file', 'uploaded_by', 'uploaded_by_name', 'is_required',
            'is_verified', 'verified_by', 'verified_by_name', 'verified_at',
            'created_at'
        ]
        read_only_fields = [
            'id', 'uploaded_by', 'verified_by', 'verified_at', 'created_at'
        ]


class AppointmentStatusHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for appointment status history.
    """
    
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = AppointmentStatusHistory
        fields = [
            'id', 'previous_status', 'new_status', 'changed_by',
            'changed_by_name', 'change_reason', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AppointmentEmailLogSerializer(serializers.ModelSerializer):
    """
    Serializer for appointment email logs.
    """
    
    email_type_display = serializers.CharField(source='get_email_type_display', read_only=True)
    
    class Meta:
        model = AppointmentEmailLog
        fields = [
            'id', 'email_type', 'email_type_display', 'recipient_email',
            'subject', 'message_body', 'is_sent', 'sent_at', 'error_message',
            'created_at'
        ]
        read_only_fields = [
            'id', 'is_sent', 'sent_at', 'error_message', 'created_at'
        ]


class BulkAppointmentActionSerializer(serializers.Serializer):
    """
    Serializer for bulk actions on appointment submissions.
    """
    
    ACTION_CHOICES = [
        ('approve', 'Approve'),
        ('decline', 'Decline'),
        ('require_info', 'Require Additional Information'),
    ]
    
    submission_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        max_length=50
    )
    action = serializers.ChoiceField(choices=ACTION_CHOICES)
    notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    
    def validate_submission_ids(self, value):
        """Validate that all submission IDs exist and are in valid state."""
        submissions = AppointmentSubmission.objects.filter(id__in=value)
        
        if len(submissions) != len(value):
            raise serializers.ValidationError("Some submission IDs are invalid.")
        
        # Check if submissions are in valid state for bulk actions
        invalid_submissions = submissions.exclude(status__in=['PENDING', 'UNDER_REVIEW'])
        if invalid_submissions.exists():
            invalid_refs = list(invalid_submissions.values_list('submission_reference', flat=True))
            raise serializers.ValidationError(
                f"These submissions cannot be bulk processed: {', '.join(invalid_refs)}"
            )
        
        return value