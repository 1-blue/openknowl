import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface BoardFormModalState {
  isShowBoardFormModal: boolean;
  targetIdx: number;
  category: string;
  file?: File;
}

const initialState: BoardFormModalState = {
  isShowBoardFormModal: false,
  targetIdx: -1,
  category: '',
};

export const boardFormModalSlice = createSlice({
  name: 'boardFormModal',
  initialState,
  reducers: {
    openBoardFormModal: (
      state,
      action: PayloadAction<{ idx?: number; category?: string; file?: File }>,
    ) => {
      state.isShowBoardFormModal = true;
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
    closeBoardFormModal: state => {
      state.isShowBoardFormModal = false;
      state.targetIdx = -1;
      state.category = '';
      state.file = undefined;
    },
  },
});

export const { openBoardFormModal, closeBoardFormModal } = boardFormModalSlice.actions;

export default boardFormModalSlice.reducer;
