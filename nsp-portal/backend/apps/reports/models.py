"""
Models for monthly reports and evaluation system.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.core.models import TimeStampedModel

User = get_user_model()


class MonthlyReport(TimeStampedModel):
    """
    Monthly reports submitted by NSPs to their supervisors.
    """
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('REVISION_REQUIRED', 'Revision Required'),
    ]
    
    # Report Information
    nsp = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='monthly_reports',
        limit_choices_to={'user_type': 'NSP'}
    )
    supervisor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='supervised_monthly_reports',
        limit_choices_to={'user_type': 'SUPERVISOR'}
    )
    
    # Report Period
    report_month = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    report_year = models.PositiveIntegerField()
    
    # Report Content
    activities_undertaken = models.TextField(
        help_text="Detailed description of activities undertaken during the month"
    )
    achievements = models.TextField(
        help_text="Key achievements and accomplishments"
    )
    challenges_faced = models.TextField(
        blank=True,
        help_text="Challenges encountered and how they were addressed"
    )
    skills_acquired = models.TextField(
        blank=True,
        help_text="New skills or knowledge acquired"
    )
    recommendations = models.TextField(
        blank=True,
        help_text="Recommendations for improvement"
    )
    
    # Working Days
    total_working_days = models.PositiveIntegerField()
    days_present = models.PositiveIntegerField()
    days_absent = models.PositiveIntegerField(default=0)
    days_on_permission = models.PositiveIntegerField(default=0)
    
    # Self Assessment
    self_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Self-rating on performance (1-5 scale)"
    )
    
    # Status and Review
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    submitted_at = models.DateTimeField(blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    supervisor_comments = models.TextField(blank=True)
    
    # Supporting Documents
    supporting_documents = models.FileField(
        upload_to='monthly_reports/%Y/%m/',
        blank=True,
        null=True,
        help_text="Supporting documents, photos, or evidence"
    )
    
    class Meta:
        verbose_name = "Monthly Report"
        verbose_name_plural = "Monthly Reports"
        unique_together = ['nsp', 'report_month', 'report_year']
        ordering = ['-report_year', '-report_month', '-created_at']
        indexes = [
            models.Index(fields=['nsp', 'status']),
            models.Index(fields=['supervisor', 'status']),
            models.Index(fields=['report_year', 'report_month']),
        ]
    
    def __str__(self):
        return f"{self.nsp.get_full_name()} - {self.report_month:02d}/{self.report_year}"
    
    def submit(self):
        """Submit the report for review."""
        self.status = 'SUBMITTED'
        self.submitted_at = timezone.now()
        self.save()
    
    def approve(self, supervisor, comments=""):
        """Approve the report."""
        self.status = 'APPROVED'
        self.supervisor = supervisor
        self.reviewed_at = timezone.now()
        self.supervisor_comments = comments
        self.save()
    
    def reject(self, supervisor, comments=""):
        """Reject the report."""
        self.status = 'REJECTED'
        self.supervisor = supervisor
        self.reviewed_at = timezone.now()
        self.supervisor_comments = comments
        self.save()
    
    @property
    def attendance_percentage(self):
        """Calculate attendance percentage."""
        if self.total_working_days > 0:
            return (self.days_present / self.total_working_days) * 100
        return 0


class PerformanceEvaluation(TimeStampedModel):
    """
    Performance evaluations conducted by supervisors for NSPs.
    """
    
    EVALUATION_TYPE_CHOICES = [
        ('MONTHLY', 'Monthly Evaluation'),
        ('QUARTERLY', 'Quarterly Evaluation'),
        ('MID_TERM', 'Mid-term Evaluation'),
        ('FINAL', 'Final Evaluation'),
    ]
    
    RATING_CHOICES = [
        (1, 'Poor'),
        (2, 'Below Average'),
        (3, 'Average'),
        (4, 'Good'),
        (5, 'Excellent'),
    ]
    
    # Evaluation Information
    nsp = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='performance_evaluations',
        limit_choices_to={'user_type': 'NSP'}
    )
    supervisor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conducted_evaluations',
        limit_choices_to={'user_type': 'SUPERVISOR'}
    )
    
    # Evaluation Period
    evaluation_type = models.CharField(max_length=20, choices=EVALUATION_TYPE_CHOICES)
    evaluation_period_start = models.DateField()
    evaluation_period_end = models.DateField()
    
    # Performance Criteria Ratings
    punctuality = models.PositiveIntegerField(choices=RATING_CHOICES)
    attendance = models.PositiveIntegerField(choices=RATING_CHOICES)
    work_quality = models.PositiveIntegerField(choices=RATING_CHOICES)
    initiative = models.PositiveIntegerField(choices=RATING_CHOICES)
    teamwork = models.PositiveIntegerField(choices=RATING_CHOICES)
    communication = models.PositiveIntegerField(choices=RATING_CHOICES)
    learning_ability = models.PositiveIntegerField(choices=RATING_CHOICES)
    professionalism = models.PositiveIntegerField(choices=RATING_CHOICES)
    
    # Overall Assessment
    overall_rating = models.PositiveIntegerField(choices=RATING_CHOICES)
    strengths = models.TextField(help_text="Key strengths observed")
    areas_for_improvement = models.TextField(help_text="Areas that need improvement")
    recommendations = models.TextField(help_text="Recommendations for development")
    future_assignments = models.TextField(
        blank=True,
        help_text="Recommended future assignments or projects"
    )
    
    # Goals and Objectives
    goals_achieved = models.TextField(
        blank=True,
        help_text="Goals achieved during the evaluation period"
    )
    goals_for_next_period = models.TextField(
        blank=True,
        help_text="Goals for the next evaluation period"
    )
    
    # NSP Response
    nsp_comments = models.TextField(
        blank=True,
        help_text="NSP's response to the evaluation"
    )
    nsp_acknowledged = models.BooleanField(default=False)
    nsp_acknowledged_at = models.DateTimeField(blank=True, null=True)
    
    # HR Review
    hr_reviewed = models.BooleanField(default=False)
    hr_reviewer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='hr_reviewed_evaluations',
        limit_choices_to={'user_type': 'HR'}
    )
    hr_comments = models.TextField(blank=True)
    hr_reviewed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Performance Evaluation"
        verbose_name_plural = "Performance Evaluations"
        ordering = ['-evaluation_period_end', '-created_at']
        indexes = [
            models.Index(fields=['nsp', '-evaluation_period_end']),
            models.Index(fields=['supervisor', '-evaluation_period_end']),
        ]
    
    def __str__(self):
        return f"{self.nsp.get_full_name()} - {self.get_evaluation_type_display()} ({self.evaluation_period_end})"
    
    @property
    def average_rating(self):
        """Calculate average rating across all criteria."""
        ratings = [
            self.punctuality, self.attendance, self.work_quality, self.initiative,
            self.teamwork, self.communication, self.learning_ability, self.professionalism
        ]
        return sum(ratings) / len(ratings)
    
    def acknowledge(self, comments=""):
        """NSP acknowledges the evaluation."""
        self.nsp_acknowledged = True
        self.nsp_acknowledged_at = timezone.now()
        self.nsp_comments = comments
        self.save()


class ReportTemplate(TimeStampedModel):
    """
    Templates for different types of reports.
    """
    
    TEMPLATE_TYPE_CHOICES = [
        ('MONTHLY_REPORT', 'Monthly Report'),
        ('EVALUATION', 'Performance Evaluation'),
        ('INCIDENT_REPORT', 'Incident Report'),
        ('PROJECT_REPORT', 'Project Report'),
    ]
    
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    
    # Template Structure
    sections = models.JSONField(
        default=list,
        help_text="List of sections and their requirements"
    )
    required_fields = models.JSONField(
        default=list,
        help_text="List of required fields"
    )
    
    # Usage
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Report Template"
        verbose_name_plural = "Report Templates"
        ordering = ['template_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"


class ReportSubmissionHistory(TimeStampedModel):
    """
    Track report submission history and changes.
    """
    
    monthly_report = models.ForeignKey(
        MonthlyReport,
        on_delete=models.CASCADE,
        related_name='submission_history',
        blank=True,
        null=True
    )
    evaluation = models.ForeignKey(
        PerformanceEvaluation,
        on_delete=models.CASCADE,
        related_name='submission_history',
        blank=True,
        null=True
    )
    
    action = models.CharField(max_length=50)
    previous_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comments = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Report Submission History"
        verbose_name_plural = "Report Submission Histories"
        ordering = ['-created_at']
    
    def __str__(self):
        report_type = "Monthly Report" if self.monthly_report else "Evaluation"
        return f"{report_type} - {self.action} by {self.user.get_full_name()}"


class ReportStatistics(TimeStampedModel):
    """
    Statistical data for reports (monthly/yearly aggregates).
    """
    
    # Time period
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField(blank=True, null=True)  # None for yearly stats
    
    # Department or user-specific stats
    department = models.CharField(max_length=100, blank=True)
    supervisor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        limit_choices_to={'user_type': 'SUPERVISOR'}
    )
    
    # Report Statistics
    total_reports_due = models.PositiveIntegerField(default=0)
    reports_submitted = models.PositiveIntegerField(default=0)
    reports_approved = models.PositiveIntegerField(default=0)
    reports_rejected = models.PositiveIntegerField(default=0)
    reports_pending = models.PositiveIntegerField(default=0)
    
    # Evaluation Statistics
    evaluations_completed = models.PositiveIntegerField(default=0)
    average_performance_rating = models.FloatField(blank=True, null=True)
    
    # Submission Timeliness
    on_time_submissions = models.PositiveIntegerField(default=0)
    late_submissions = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = "Report Statistics"
        verbose_name_plural = "Report Statistics"
        unique_together = ['year', 'month', 'department', 'supervisor']
        ordering = ['-year', '-month']
    
    def __str__(self):
        period = f"{self.year}-{self.month:02d}" if self.month else str(self.year)
        context = self.department or (self.supervisor.get_full_name() if self.supervisor else "Overall")
        return f"Report Stats {period} - {context}"
    
    @property
    def submission_rate(self):
        """Calculate submission rate percentage."""
        if self.total_reports_due > 0:
            return (self.reports_submitted / self.total_reports_due) * 100
        return 0