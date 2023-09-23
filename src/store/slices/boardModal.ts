import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface BoardModalState {
  isShow: boolean;
  targetIdx: number;
  category: string;
}

const initialState: BoardModalState = {
  isShow: false,
  targetIdx: -1,
  category: '',
};

export const boardModalSlice = createSlice({
  name: 'boardModal',
  initialState,
  reducers: {
    openBoardModal: (state, action: PayloadAction<{ idx?: number; category?: string }>) => {
      state.isShow = true;
      if (action.payload.idx) {
        state.targetIdx = action.payload.idx;
      }
      if (action.payload.category) {
        state.category = action.payload.category;
      }
    },
    closeBoardModal: state => {
      state.isShow = false;
      state.targetIdx = -1;
      state.category = '';
    },
  },
});

export const { openBoardModal, closeBoardModal } = boardModalSlice.actions;

export default boardModalSlice.reducer;
