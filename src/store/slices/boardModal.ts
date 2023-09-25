import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface BoardModalState {
  isShowBoardModal: boolean;
  targetIdx: number;
  category: string;
  file?: File;
}

const initialState: BoardModalState = {
  isShowBoardModal: false,
  targetIdx: -1,
  category: '',
};

export const boardModalSlice = createSlice({
  name: 'boardModal',
  initialState,
  reducers: {
    openBoardModal: (
      state,
      action: PayloadAction<{ idx?: number; category?: string; file?: File }>,
    ) => {
      state.isShowBoardModal = true;
      if (action.payload.idx) {
        state.targetIdx = action.payload.idx;
      }
      if (action.payload.category) {
        state.category = action.payload.category;
      }
      if (action.payload.file) {
        state.file = action.payload.file;
      }
    },
    closeBoardModal: state => {
      state.isShowBoardModal = false;
      state.targetIdx = -1;
      state.category = '';
      state.file = undefined;
    },
  },
});

export const { openBoardModal, closeBoardModal } = boardModalSlice.actions;

export default boardModalSlice.reducer;
