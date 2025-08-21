import { createSlice } from '@reduxjs/toolkit';

interface PermissionState {
  requests: any[];
  currentRequest: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = permissionSlice.actions;
export default permissionSlice.reducer;