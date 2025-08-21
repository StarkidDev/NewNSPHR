"""
API views for the core app.
"""

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Announcement, Department, Document, Notification, ActivityLog


class AnnouncementListView(generics.ListAPIView):
    """List announcements."""
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class AnnouncementDetailView(generics.RetrieveAPIView):
    """View announcement details."""
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class DepartmentListView(generics.ListAPIView):
    """List departments."""
    queryset = Department.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class DocumentListView(generics.ListAPIView):
    """List documents."""
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class DocumentUploadView(generics.CreateAPIView):
    """Upload document."""
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class NotificationListView(generics.ListAPIView):
    """List notifications."""
    queryset = Notification.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class NotificationReadView(APIView):
    """Mark notification as read."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        return Response({'message': 'Marked as read'})


class ActivityLogListView(generics.ListAPIView):
    """List activity logs."""
    queryset = ActivityLog.objects.all()
    permission_classes = [permissions.IsAuthenticated]