import { createSlice } from '@reduxjs/toolkit';

export interface SpinnerState {
  isStartSpinner: boolean;
}

const initialState: SpinnerState = {
  isStartSpinner: false,
};

export const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    startSpinner: state => {
      state.isStartSpinner = true;
    },
    stopSpinner: state => {
      state.isStartSpinner = false;
    },
  },
});

export const { startSpinner, stopSpinner } = spinnerSlice.actions;

export default spinnerSlice.reducer;
