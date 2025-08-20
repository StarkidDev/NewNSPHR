"""
URL patterns for the reports app.
"""

from django.urls import path
from . import views

app_name = 'reports'

urlpatterns = [
    # Monthly Reports
    path('monthly/', views.MonthlyReportListView.as_view(), name='monthly-list'),
    path('monthly/create/', views.MonthlyReportCreateView.as_view(), name='monthly-create'),
    path('monthly/<int:pk>/', views.MonthlyReportDetailView.as_view(), name='monthly-detail'),
    path('monthly/<int:pk>/submit/', views.MonthlyReportSubmitView.as_view(), name='monthly-submit'),
    path('monthly/<int:pk>/review/', views.MonthlyReportReviewView.as_view(), name='monthly-review'),
    
    # Performance Evaluations
    path('evaluations/', views.PerformanceEvaluationListView.as_view(), name='evaluation-list'),
    path('evaluations/create/', views.PerformanceEvaluationCreateView.as_view(), name='evaluation-create'),
    path('evaluations/<int:pk>/', views.PerformanceEvaluationDetailView.as_view(), name='evaluation-detail'),
    
    # Templates and Statistics
    path('templates/', views.ReportTemplateListView.as_view(), name='template-list'),
    path('stats/', views.ReportStatsView.as_view(), name='stats'),
]