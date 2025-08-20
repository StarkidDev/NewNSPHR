"""
API views for the appointments app.
"""

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    AppointmentSubmission, AppointmentDocument,
    AppointmentStatusHistory, AppointmentEmailLog
)
from .serializers import (
    AppointmentSubmissionCreateSerializer, AppointmentSubmissionSerializer,
    AppointmentSubmissionStatusSerializer, AppointmentSubmissionReviewSerializer,
    AppointmentDocumentSerializer, AppointmentStatusHistorySerializer,
    BulkAppointmentActionSerializer
)
from apps.core.models import ActivityLog
from apps.accounts.models import User, NSPProfile


class AppointmentSubmissionCreateView(generics.CreateAPIView):
    """
    Public endpoint for NSPs to submit appointment letters (no authentication required).
    """
    
    queryset = AppointmentSubmission.objects.all()
    serializer_class = AppointmentSubmissionCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        """Save the submission and send confirmation email."""
        submission = serializer.save()
        
        # Send confirmation email
        self._send_confirmation_email(submission)
        
        # Log the submission
        ActivityLog.objects.create(
            user_id=1,  # System user for anonymous submissions
            action='CREATE',
            description=f'New appointment submission: {submission.submission_reference}',
            ip_address=self.request.META.get('REMOTE_ADDR', ''),
            object_repr=str(submission)
        )
    
    def _send_confirmation_email(self, submission):
        """Send confirmation email to the applicant."""
        try:
            subject = f'NSP Portal - Appointment Submission Received ({submission.submission_reference})'
            message = f'''
Dear {submission.full_name},

Thank you for submitting your NSS appointment letter through the GNPC NSP Portal.

Your submission details:
- Reference Number: {submission.submission_reference}
- NSS ID: {submission.nss_id}
- Program: {submission.get_program_display()}
- Service Year: {submission.service_year}

Your submission is now being reviewed by our HR team. You will receive an email notification once a decision has been made.

You can check your submission status at any time by visiting our portal and entering your email address.

Best regards,
GNPC HR Team
            '''.strip()
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[submission.email],
                fail_silently=True
            )
            
            # Log successful email
            AppointmentEmailLog.objects.create(
                appointment_submission=submission,
                email_type='CONFIRMATION',
                recipient_email=submission.email,
                subject=subject,
                message_body=message,
                is_sent=True,
                sent_at=timezone.now()
            )
            
        except Exception as e:
            # Log failed email
            AppointmentEmailLog.objects.create(
                appointment_submission=submission,
                email_type='CONFIRMATION',
                recipient_email=submission.email,
                subject=subject,
                message_body=message,
                is_sent=False,
                error_message=str(e)
            )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_submission_status(request):
    """
    Public endpoint to check appointment submission status by email.
    """
    
    email = request.query_params.get('email')
    if not email:
        return Response(
            {'error': 'Email parameter is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        submission = AppointmentSubmission.objects.get(email=email)
        serializer = AppointmentSubmissionStatusSerializer(submission)
        return Response(serializer.data)
    except AppointmentSubmission.DoesNotExist:
        return Response(
            {'error': 'No submission found with this email address'}, 
            status=status.HTTP_404_NOT_FOUND
        )


class AppointmentSubmissionListView(generics.ListAPIView):
    """
    HR endpoint to view all appointment submissions.
    """
    
    queryset = AppointmentSubmission.objects.all()
    serializer_class = AppointmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'program', 'service_year']
    search_fields = ['full_name', 'email', 'nss_id', 'submission_reference']
    ordering_fields = ['created_at', 'reviewed_at', 'decision_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter based on user permissions."""
        if self.request.user.is_hr or self.request.user.is_admin_user:
            return AppointmentSubmission.objects.select_related('reviewed_by')
        return AppointmentSubmission.objects.none()


class AppointmentSubmissionDetailView(generics.RetrieveAPIView):
    """
    HR endpoint to view individual appointment submission.
    """
    
    queryset = AppointmentSubmission.objects.all()
    serializer_class = AppointmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter based on user permissions."""
        if self.request.user.is_hr or self.request.user.is_admin_user:
            return AppointmentSubmission.objects.select_related('reviewed_by')
        return AppointmentSubmission.objects.none()


class AppointmentSubmissionReviewView(generics.UpdateAPIView):
    """
    HR endpoint to review and update appointment submissions.
    """
    
    queryset = AppointmentSubmission.objects.all()
    serializer_class = AppointmentSubmissionReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only HR can review submissions."""
        if self.request.user.is_hr or self.request.user.is_admin_user:
            return AppointmentSubmission.objects.all()
        return AppointmentSubmission.objects.none()
    
    def perform_update(self, serializer):
        """Update submission and create status history."""
        submission = self.get_object()
        previous_status = submission.status
        
        # Update the submission
        updated_submission = serializer.save(
            reviewed_by=self.request.user,
            reviewed_at=timezone.now()
        )
        
        # If status changed to APPROVED or DECLINED, set decision date
        if updated_submission.status in ['APPROVED', 'DECLINED']:
            updated_submission.decision_date = timezone.now()
            updated_submission.save()
            
            # Create user account if approved
            if updated_submission.status == 'APPROVED':
                self._create_user_account(updated_submission)
        
        # Create status history
        AppointmentStatusHistory.objects.create(
            appointment_submission=updated_submission,
            previous_status=previous_status,
            new_status=updated_submission.status,
            changed_by=self.request.user,
            change_reason=serializer.validated_data.get('review_notes', '')
        )
        
        # Log activity
        ActivityLog.objects.create(
            user=self.request.user,
            action='UPDATE',
            description=f'Reviewed appointment submission {updated_submission.submission_reference}',
            ip_address=self.request.META.get('REMOTE_ADDR', ''),
            object_repr=str(updated_submission)
        )
        
        # Send notification email
        self._send_decision_email(updated_submission)
    
    def _create_user_account(self, submission):
        """Create user account for approved NSP."""
        try:
            # Generate username from email
            username = submission.email.split('@')[0]
            if User.objects.filter(username=username).exists():
                username = f"{username}_{submission.nss_id}"
            
            # Generate temporary password
            import uuid
            temp_password = str(uuid.uuid4())[:8]
            
            # Create user
            user = User.objects.create_user(
                username=username,
                email=submission.email,
                first_name=submission.full_name.split()[0],
                last_name=' '.join(submission.full_name.split()[1:]),
                user_type='NSP',
                phone_number=submission.phone_number,
                password=temp_password
            )
            
            # Create NSP Profile
            nsp_profile = NSPProfile.objects.create(
                user=user,
                nss_id=submission.nss_id,
                program=submission.program,
                service_year=submission.service_year,
                institution_attended=submission.institution_attended,
                qualification=submission.qualification,
                course_of_study=submission.course_of_study,
                status='ACTIVE'
            )
            
            # Link submission to created user
            submission.created_user = user
            submission.save()
            
            # Send login credentials
            self._send_credentials_email(submission, username, temp_password)
            
        except Exception as e:
            # Log error but don't fail the approval
            ActivityLog.objects.create(
                user=self.request.user,
                action='ERROR',
                description=f'Failed to create user account for {submission.submission_reference}: {str(e)}',
                ip_address=self.request.META.get('REMOTE_ADDR', '')
            )
    
    def _send_credentials_email(self, submission, username, password):
        """Send login credentials to approved NSP."""
        try:
            subject = f'NSP Portal - Login Credentials ({submission.submission_reference})'
            message = f'''
Dear {submission.full_name},

Your NSP Portal account has been created successfully!

Login Credentials:
- Portal URL: {self.request.build_absolute_uri('/')[:-1]}
- Username: {username}
- Temporary Password: {password}

Please log in and change your password immediately for security.

Next Steps:
1. Complete your profile information
2. Upload any additional required documents
3. Review your department assignment

Welcome to GNPC!

Best regards,
GNPC HR Team
            '''.strip()
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[submission.email],
                fail_silently=True
            )
            
            AppointmentEmailLog.objects.create(
                appointment_submission=submission,
                email_type='CREDENTIALS',
                recipient_email=submission.email,
                subject=subject,
                message_body=message,
                is_sent=True,
                sent_at=timezone.now()
            )
            
        except Exception as e:
            AppointmentEmailLog.objects.create(
                appointment_submission=submission,
                email_type='CREDENTIALS',
                recipient_email=submission.email,
                subject=subject,
                message_body=message,
                is_sent=False,
                error_message=str(e)
            )
    
    def _send_decision_email(self, submission):
        """Send email notification about the decision."""
        if submission.status == 'APPROVED':
            subject = f'NSP Portal - Application Approved ({submission.submission_reference})'
            message = f'''
Dear {submission.full_name},

Congratulations! Your NSS appointment letter submission has been approved.

Submission Reference: {submission.submission_reference}

You will receive separate login credentials shortly to access your NSP Portal account.

Welcome to GNPC!

Best regards,
GNPC HR Team
            '''.strip()
            
        elif submission.status == 'DECLINED':
            subject = f'NSP Portal - Application Status Update ({submission.submission_reference})'
            message = f'''
Dear {submission.full_name},

Thank you for your interest in serving at GNPC. After careful review, we regret to inform you that your NSS appointment letter submission has not been approved at this time.

Submission Reference: {submission.submission_reference}

Reason: {submission.review_notes or 'Please contact HR for more information.'}

If you have any questions, please contact our HR department.

Best regards,
GNPC HR Team
            '''.strip()
            
        else:
            return  # No email for other statuses
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[submission.email],
                fail_silently=True
            )
            
            AppointmentEmailLog.objects.create(
                appointment_submission=submission,
                email_type='APPROVAL' if submission.status == 'APPROVED' else 'REJECTION',
                recipient_email=submission.email,
                subject=subject,
                message_body=message,
                is_sent=True,
                sent_at=timezone.now()
            )
            
        except Exception as e:
            AppointmentEmailLog.objects.create(
                appointment_submission=submission,
                email_type='APPROVAL' if submission.status == 'APPROVED' else 'REJECTION',
                recipient_email=submission.email,
                subject=subject,
                message_body=message,
                is_sent=False,
                error_message=str(e)
            )


class BulkAppointmentActionView(APIView):
    """
    HR endpoint for bulk actions on appointment submissions.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Perform bulk action on appointment submissions."""
        if not (request.user.is_hr or request.user.is_admin_user):
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = BulkAppointmentActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        submission_ids = serializer.validated_data['submission_ids']
        action = serializer.validated_data['action']
        notes = serializer.validated_data.get('notes', '')
        
        submissions = AppointmentSubmission.objects.filter(id__in=submission_ids)
        updated_count = 0
        
        for submission in submissions:
            previous_status = submission.status
            
            if action == 'approve':
                submission.status = 'APPROVED'
            elif action == 'decline':
                submission.status = 'DECLINED'
            elif action == 'require_info':
                submission.status = 'REQUIRES_INFO'
            
            submission.reviewed_by = request.user
            submission.reviewed_at = timezone.now()
            submission.review_notes = notes
            
            if submission.status in ['APPROVED', 'DECLINED']:
                submission.decision_date = timezone.now()
            
            submission.save()
            
            # Create status history
            AppointmentStatusHistory.objects.create(
                appointment_submission=submission,
                previous_status=previous_status,
                new_status=submission.status,
                changed_by=request.user,
                change_reason=f'Bulk action: {action}. {notes}'
            )
            
            updated_count += 1
        
        # Log activity
        ActivityLog.objects.create(
            user=request.user,
            action='UPDATE',
            description=f'Bulk {action} on {updated_count} appointment submissions',
            ip_address=request.META.get('REMOTE_ADDR', ''),
            extra_data={'submission_ids': submission_ids, 'action': action}
        )
        
        return Response({
            'message': f'Successfully {action}ed {updated_count} submissions',
            'updated_count': updated_count
        })


class AppointmentSubmissionStatsView(APIView):
    """
    HR endpoint to get appointment submission statistics.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get appointment submission statistics."""
        if not (request.user.is_hr or request.user.is_admin_user):
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Basic counts
        total_submissions = AppointmentSubmission.objects.count()
        pending_submissions = AppointmentSubmission.objects.filter(status='PENDING').count()
        approved_submissions = AppointmentSubmission.objects.filter(status='APPROVED').count()
        declined_submissions = AppointmentSubmission.objects.filter(status='DECLINED').count()
        under_review = AppointmentSubmission.objects.filter(status='UNDER_REVIEW').count()
        
        # Monthly statistics
        current_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_submissions = AppointmentSubmission.objects.filter(
            created_at__gte=current_month
        ).count()
        
        # Program breakdown
        program_stats = {}
        for choice in AppointmentSubmission.PROGRAM_CHOICES:
            program_stats[choice[1]] = AppointmentSubmission.objects.filter(
                program=choice[0]
            ).count()
        
        # Recent activity
        recent_submissions = AppointmentSubmission.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()
        
        return Response({
            'total_submissions': total_submissions,
            'pending_submissions': pending_submissions,
            'approved_submissions': approved_submissions,
            'declined_submissions': declined_submissions,
            'under_review': under_review,
            'monthly_submissions': monthly_submissions,
            'recent_submissions': recent_submissions,
            'program_breakdown': program_stats,
        })


class AppointmentDocumentListView(generics.ListCreateAPIView):
    """
    Endpoint for managing appointment documents.
    """
    
    queryset = AppointmentDocument.objects.all()
    serializer_class = AppointmentDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['document_type', 'is_verified', 'is_required']
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        """Set the uploaded_by field."""
        serializer.save(uploaded_by=self.request.user)


class AppointmentStatusHistoryView(generics.ListAPIView):
    """
    Endpoint to view appointment status history.
    """
    
    queryset = AppointmentStatusHistory.objects.all()
    serializer_class = AppointmentStatusHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['appointment_submission', 'new_status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter based on permissions."""
        if self.request.user.is_hr or self.request.user.is_admin_user:
            return AppointmentStatusHistory.objects.select_related(
                'appointment_submission', 'changed_by'
            )
        return AppointmentStatusHistory.objects.none()