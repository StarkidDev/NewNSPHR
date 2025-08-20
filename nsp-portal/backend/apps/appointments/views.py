"""
API views for the appointments app.
"""

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import AppointmentSubmission, GNPCAppointmentLetter, AppointmentDocument
from .serializers import (
    AppointmentSubmissionCreateSerializer, AppointmentSubmissionSerializer,
    AppointmentSubmissionStatusSerializer, AppointmentSubmissionReviewSerializer
)


class AppointmentSubmissionCreateView(generics.CreateAPIView):
    """
    Public endpoint for NSPs to submit appointment letters (no authentication required).
    """
    
    queryset = AppointmentSubmission.objects.all()
    serializer_class = AppointmentSubmissionCreateSerializer
    permission_classes = [permissions.AllowAny]


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