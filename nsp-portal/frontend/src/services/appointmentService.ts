import api from './api';

export interface AppointmentSubmission {
  id?: number;
  full_name: string;
  email: string;
  phone_number: string;
  nss_id: string;
  program: 'REGULAR' | 'TEACHERS' | 'HEALTH' | 'GRADUATE';
  service_year: number;
  institution_attended: string;
  qualification: string;
  course_of_study: string;
  nss_appointment_letter: File | null;
  status?: string;
  status_display?: string;
  submission_reference?: string;
  created_at?: string;
  reviewed_at?: string;
  decision_date?: string;
}

export interface AppointmentSubmissionResponse {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  nss_id: string;
  program: string;
  program_display: string;
  service_year: number;
  institution_attended: string;
  qualification: string;
  course_of_study: string;
  status: string;
  status_display: string;
  submission_reference: string;
  reviewed_by?: number;
  reviewed_by_name?: string;
  reviewed_at?: string;
  review_notes?: string;
  decision_date?: string;
  decision_notes?: string;
  created_at: string;
}

export interface StatusCheckResponse {
  submission_reference: string;
  full_name: string;
  status: string;
  status_display: string;
  program_display: string;
  created_at: string;
  reviewed_at?: string;
  decision_date?: string;
}

export interface AppointmentStats {
  total_submissions: number;
  pending_submissions: number;
  approved_submissions: number;
  declined_submissions: number;
  under_review: number;
  monthly_submissions: number;
  recent_submissions: number;
  program_breakdown: Record<string, number>;
}

class AppointmentService {
  // Public endpoints (no auth required)
  async submitAppointment(appointmentData: FormData): Promise<AppointmentSubmissionResponse> {
    const response = await api.post('/appointments/submit/', appointmentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async checkStatus(email: string): Promise<StatusCheckResponse> {
    const response = await api.get(`/appointments/status/?email=${encodeURIComponent(email)}`);
    return response.data;
  }

  // HR endpoints (auth required)
  async getSubmissions(params?: {
    status?: string;
    program?: string;
    service_year?: number;
    search?: string;
    page?: number;
  }): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: AppointmentSubmissionResponse[];
  }> {
    const response = await api.get('/appointments/submissions/', { params });
    return response.data;
  }

  async getSubmissionDetail(id: number): Promise<AppointmentSubmissionResponse> {
    const response = await api.get(`/appointments/submissions/${id}/`);
    return response.data;
  }

  async reviewSubmission(
    id: number,
    reviewData: {
      status: string;
      review_notes?: string;
      decision_notes?: string;
    }
  ): Promise<AppointmentSubmissionResponse> {
    const response = await api.put(`/appointments/submissions/${id}/review/`, reviewData);
    return response.data;
  }

  async bulkAction(data: {
    submission_ids: number[];
    action: 'approve' | 'decline' | 'require_info';
    notes?: string;
  }): Promise<{ message: string; updated_count: number }> {
    const response = await api.post('/appointments/bulk-action/', data);
    return response.data;
  }

  async getStats(): Promise<AppointmentStats> {
    const response = await api.get('/appointments/stats/');
    return response.data;
  }

  async getStatusHistory(submissionId: number): Promise<any[]> {
    const response = await api.get(`/appointments/history/?appointment_submission=${submissionId}`);
    return response.data.results;
  }

  // Document management
  async uploadDocument(documentData: FormData): Promise<any> {
    const response = await api.post('/appointments/documents/', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDocuments(submissionId?: number): Promise<any[]> {
    const params = submissionId ? { appointment_submission: submissionId } : {};
    const response = await api.get('/appointments/documents/', { params });
    return response.data.results;
  }
}

export const appointmentService = new AppointmentService();