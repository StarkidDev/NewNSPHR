"""
API views for the reports app.
"""

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import MonthlyReport, PerformanceEvaluation


class MonthlyReportListView(generics.ListAPIView):
    """List monthly reports."""
    queryset = MonthlyReport.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class MonthlyReportCreateView(generics.CreateAPIView):
    """Create monthly report."""
    queryset = MonthlyReport.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class MonthlyReportDetailView(generics.RetrieveAPIView):
    """View monthly report details."""
    queryset = MonthlyReport.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class MonthlyReportSubmitView(APIView):
    """Submit monthly report."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        return Response({'message': 'Submitted'})


class MonthlyReportReviewView(APIView):
    """Review monthly report."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        return Response({'message': 'Reviewed'})


class PerformanceEvaluationListView(generics.ListAPIView):
    """List performance evaluations."""
    queryset = PerformanceEvaluation.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class PerformanceEvaluationCreateView(generics.CreateAPIView):
    """Create performance evaluation."""
    queryset = PerformanceEvaluation.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class PerformanceEvaluationDetailView(generics.RetrieveAPIView):
    """View performance evaluation details."""
    queryset = PerformanceEvaluation.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class ReportTemplateListView(APIView):
    """List report templates."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({'templates': []})


class ReportStatsView(APIView):
    """Report statistics."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({'stats': {}})