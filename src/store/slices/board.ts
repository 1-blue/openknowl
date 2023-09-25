import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface BoardState {
  isShowBoardForm: boolean;
  targetIdx: number;
  category: string;
  file?: File;
}

const initialState: BoardState = {
  isShowBoardForm: false,
  targetIdx: -1,
  category: '',
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    openBoardForm: (
      state,
      action: PayloadAction<{ idx?: number; category?: string; file?: File }>,
    ) => {
      state.isShowBoardForm = true;
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
    closeBoardForm: state => {
      state.isShowBoardForm = false;
      state.targetIdx = -1;
      state.category = '';
      state.file = undefined;
    },
    openBoardDetail: () => {},
    closeBoardDetail: () => {},
  },
});

export const { openBoardForm, closeBoardForm, openBoardDetail, closeBoardDetail } =
  boardSlice.actions;

export default boardSlice.reducer;
