import { createSlice } from '@reduxjs/toolkit';

interface ReportState {
  monthlyReports: any[];
  evaluations: any[];
  currentReport: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  monthlyReports: [],
  evaluations: [],
  currentReport: null,
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;