"""
API views for the communications app.
"""

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Complaint, Message, Feedback
from apps.core.models import Announcement


class ComplaintListView(generics.ListAPIView):
    """List complaints."""
    queryset = Complaint.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class ComplaintCreateView(generics.CreateAPIView):
    """Create complaint."""
    queryset = Complaint.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class ComplaintDetailView(generics.RetrieveAPIView):
    """View complaint details."""
    queryset = Complaint.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class ComplaintResponseView(APIView):
    """Respond to complaint."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        return Response({'message': 'Response sent'})


class MessageListView(generics.ListAPIView):
    """List messages."""
    queryset = Message.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class MessageCreateView(generics.CreateAPIView):
    """Send message."""
    queryset = Message.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class MessageDetailView(generics.RetrieveAPIView):
    """View message details."""
    queryset = Message.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class FeedbackListView(generics.ListAPIView):
    """List feedback."""
    queryset = Feedback.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class FeedbackCreateView(generics.CreateAPIView):
    """Create feedback."""
    queryset = Feedback.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class FeedbackDetailView(generics.RetrieveAPIView):
    """View feedback details."""
    queryset = Feedback.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class AnnouncementListView(generics.ListAPIView):
    """List announcements."""
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticated]