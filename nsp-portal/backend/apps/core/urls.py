"""
URL patterns for the core app.
"""

from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # Announcements
    path('announcements/', views.AnnouncementListView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    
    # Departments
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    
    # Documents
    path('documents/', views.DocumentListView.as_view(), name='document-list'),
    path('documents/upload/', views.DocumentUploadView.as_view(), name='document-upload'),
    
    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', views.NotificationReadView.as_view(), name='notification-read'),
    
    # System
    path('activity-logs/', views.ActivityLogListView.as_view(), name='activity-log-list'),
]