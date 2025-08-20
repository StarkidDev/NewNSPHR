import { createSlice } from '@reduxjs/toolkit';

interface CommunicationState {
  complaints: any[];
  messages: any[];
  announcements: any[];
  currentItem: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunicationState = {
  complaints: [],
  messages: [],
  announcements: [],
  currentItem: null,
  loading: false,
  error: null,
};

const communicationSlice = createSlice({
  name: 'communications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = communicationSlice.actions;
export default communicationSlice.reducer;