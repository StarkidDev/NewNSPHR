"""
API views for the accounts app.
"""

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, NSPProfile, SupervisorProfile


class UserProfileView(generics.RetrieveAPIView):
    """View user profile."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """Update user profile."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Change user password."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        return Response({'message': 'Password changed'})


class NSPProfileListView(generics.ListAPIView):
    """List NSP profiles."""
    queryset = NSPProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class NSPProfileDetailView(generics.RetrieveAPIView):
    """View NSP profile details."""
    queryset = NSPProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class SupervisorListView(generics.ListAPIView):
    """List supervisors."""
    queryset = SupervisorProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class DashboardView(APIView):
    """User dashboard."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({'dashboard': {}})