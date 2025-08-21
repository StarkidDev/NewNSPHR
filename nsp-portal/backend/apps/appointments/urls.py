"""
URL patterns for the appointments app.
"""

from django.urls import path
from . import views

app_name = 'appointments'

urlpatterns = [
    # Public endpoints (no authentication required)
    path('submit/', views.AppointmentSubmissionCreateView.as_view(), name='submit'),
    path('status/', views.check_submission_status, name='check-status'),
    
    # HR endpoints (authentication required)
    path('submissions/', views.AppointmentSubmissionListView.as_view(), name='submissions-list'),
    path('submissions/<int:pk>/', views.AppointmentSubmissionDetailView.as_view(), name='submission-detail'),
    path('submissions/<int:pk>/review/', views.AppointmentSubmissionReviewView.as_view(), name='submission-review'),
    path('bulk-action/', views.BulkAppointmentActionView.as_view(), name='bulk-action'),
    
    # Documents
    path('documents/', views.AppointmentDocumentListView.as_view(), name='documents-list'),
    
    # History and Statistics
    path('history/', views.AppointmentStatusHistoryView.as_view(), name='history'),
    path('stats/', views.AppointmentSubmissionStatsView.as_view(), name='stats'),
]