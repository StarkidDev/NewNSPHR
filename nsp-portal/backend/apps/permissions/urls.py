"""
URL patterns for the permissions app.
"""

from django.urls import path
from . import views

app_name = 'permissions'

urlpatterns = [
    # Permission Requests
    path('requests/', views.PermissionRequestListView.as_view(), name='request-list'),
    path('requests/create/', views.PermissionRequestCreateView.as_view(), name='request-create'),
    path('requests/<int:pk>/', views.PermissionRequestDetailView.as_view(), name='request-detail'),
    path('requests/<int:pk>/approve/', views.PermissionRequestApproveView.as_view(), name='request-approve'),
    path('requests/<int:pk>/decline/', views.PermissionRequestDeclineView.as_view(), name='request-decline'),
    
    # Calendar and Statistics
    path('calendar/', views.PermissionCalendarView.as_view(), name='calendar'),
    path('stats/', views.PermissionStatsView.as_view(), name='stats'),
    
    # Templates
    path('templates/', views.PermissionTemplateListView.as_view(), name='template-list'),
]