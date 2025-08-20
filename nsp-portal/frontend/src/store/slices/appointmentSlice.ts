import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentService, AppointmentSubmissionResponse, AppointmentStats } from '../../services/appointmentService';

interface AppointmentState {
  submissions: AppointmentSubmissionResponse[];
  currentSubmission: AppointmentSubmissionResponse | null;
  stats: AppointmentStats | null;
  statusCheck: any | null;
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

const initialState: AppointmentState = {
  submissions: [],
  currentSubmission: null,
  stats: null,
  statusCheck: null,
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

export const fetchSubmissions = createAsyncThunk(
  'appointments/fetchSubmissions',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await appointmentService.getSubmissions(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch submissions');
    }
  }
);

export const fetchSubmissionDetail = createAsyncThunk(
  'appointments/fetchSubmissionDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      return await appointmentService.getSubmissionDetail(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch submission details');
    }
  }
);

export const reviewSubmission = createAsyncThunk(
  'appointments/reviewSubmission',
  async ({ id, reviewData }: { id: number; reviewData: any }, { rejectWithValue }) => {
    try {
      return await appointmentService.reviewSubmission(id, reviewData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to review submission');
    }
  }
);

export const bulkAction = createAsyncThunk(
  'appointments/bulkAction',
  async (data: { submission_ids: number[]; action: string; notes?: string }, { rejectWithValue }) => {
    try {
      return await appointmentService.bulkAction(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to perform bulk action');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'appointments/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await appointmentService.getStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch statistics');
    }
  }
);

export const checkStatus = createAsyncThunk(
  'appointments/checkStatus',
  async (email: string, { rejectWithValue }) => {
    try {
      return await appointmentService.checkStatus(email);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'No submission found with this email');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStatusCheck: (state) => {
      state.statusCheck = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch submission detail
      .addCase(fetchSubmissionDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubmission = action.payload;
      })
      .addCase(fetchSubmissionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Review submission
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
        // Update in submissions list if present
        const index = state.submissions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
      })
      // Bulk action
      .addCase(bulkAction.fulfilled, (state) => {
        // Refresh submissions after bulk action
      })
      // Fetch stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Check status
      .addCase(checkStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCheck = action.payload;
      })
      .addCase(checkStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearStatusCheck } = appointmentSlice.actions;
export default appointmentSlice.reducer;