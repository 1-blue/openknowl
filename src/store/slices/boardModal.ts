import { boardCategoryNameTable } from '@/utils/board';
import { Category } from '@prisma/client';
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
    openBoardModal: (state, action: PayloadAction<{ idx?: number; category: Category }>) => {
      state.isShow = true;
      state.category = boardCategoryNameTable[action.payload.category];
      if (action.payload.idx) {
        state.targetIdx = action.payload.idx;
      }
    },
    closeBoardModal: state => {
      state.isShow = false;
      state.targetIdx = -1;
    },
  },
});

export const { openBoardModal, closeBoardModal } = boardModalSlice.actions;

export default boardModalSlice.reducer;
