import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface BoardState {
  isShowBoardForm: boolean;
  targetIdx: number;
  category: string;
  file?: File;

  isShowBoardDetail: boolean;
}

const initialState: BoardState = {
  isShowBoardForm: false,
  targetIdx: -1,
  category: '',

  isShowBoardDetail: false,
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

    openBoardDetail: (state, action: PayloadAction<{ targetIdx: number }>) => {
      state.isShowBoardDetail = true;
      state.targetIdx = action.payload.targetIdx;
    },
    closeBoardDetail: state => {
      state.isShowBoardDetail = false;
      state.targetIdx = -1;
    },
  },
});

export const { openBoardForm, closeBoardForm, openBoardDetail, closeBoardDetail } =
  boardSlice.actions;

export default boardSlice.reducer;
