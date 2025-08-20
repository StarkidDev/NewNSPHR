"""
URL patterns for the accounts app.
"""

from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # User Profile
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='profile-update'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # NSP Profiles
    path('nsps/', views.NSPProfileListView.as_view(), name='nsp-list'),
    path('nsps/<int:pk>/', views.NSPProfileDetailView.as_view(), name='nsp-detail'),
    
    # Supervisors
    path('supervisors/', views.SupervisorListView.as_view(), name='supervisor-list'),
    
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
]