"""
URL patterns for the communications app.
"""

from django.urls import path
from . import views

app_name = 'communications'

urlpatterns = [
    # Complaints
    path('complaints/', views.ComplaintListView.as_view(), name='complaint-list'),
    path('complaints/create/', views.ComplaintCreateView.as_view(), name='complaint-create'),
    path('complaints/<int:pk>/', views.ComplaintDetailView.as_view(), name='complaint-detail'),
    path('complaints/<int:pk>/respond/', views.ComplaintResponseView.as_view(), name='complaint-respond'),
    
    # Messages
    path('messages/', views.MessageListView.as_view(), name='message-list'),
    path('messages/send/', views.MessageCreateView.as_view(), name='message-send'),
    path('messages/<int:pk>/', views.MessageDetailView.as_view(), name='message-detail'),
    
    # Feedback
    path('feedback/', views.FeedbackListView.as_view(), name='feedback-list'),
    path('feedback/create/', views.FeedbackCreateView.as_view(), name='feedback-create'),
    path('feedback/<int:pk>/', views.FeedbackDetailView.as_view(), name='feedback-detail'),
    
    # Announcements (from core app)
    path('announcements/', views.AnnouncementListView.as_view(), name='announcement-list'),
]