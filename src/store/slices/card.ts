import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CardState {
  createState: {
    /** 카드가 생성될 보드의 기본 카테고리 */
    defaultCategory: string;
    /** Drag & Drop으로 PDF를 업로드하는 경우 나머지 내용을 작성하는 동안 저장될 파일 */
    pdfFile?: File;
  };

  /** 카드 생성 폼을 보여줄지 여부 */
  isShowCardForm: boolean;
  /** 수정인 경우 수정할 카드의 식별자 */
  targetIdx: number;

  /** 카드 상세 보기 모달을 보여줄지 여부 */
  isShowCardDetail: boolean;
}

const initialState: CardState = {
  createState: {
    defaultCategory: '',
  },

  isShowCardForm: false,
  targetIdx: -1,

  isShowCardDetail: false,
};

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    /** 일반 카드 생성 폼 열기 */
    openCreateCardForm: (state, action: PayloadAction<{ defaultCategory: string }>) => {
      state.isShowCardForm = true;
      state.createState.defaultCategory = action.payload.defaultCategory;
    },
    /** `PDF Drag & Drop`으로 카드 생성 폼 열기 */
    openCreateCardFormByPDF: (state, action: PayloadAction<{ pdfFile: File }>) => {
      state.isShowCardForm = true;
      state.createState.pdfFile = action.payload.pdfFile;
    },
    openCardForm: (
      state,
      action: PayloadAction<{
        idx?: number;
        targetBoardIdx?: number;
        defaultCategory?: string;
        pdfFile?: File;
      }>,
    ) => {
      state.isShowCardForm = true;

      // "Drag & Drop"으로 카드를 생성하는 경우
      if (action.payload.pdfFile) {
        state.createState.pdfFile = action.payload.pdfFile;
      }

      if (action.payload.idx) {
        state.targetIdx = action.payload.idx;
      }
    },
    closeCardForm: state => {
      state.isShowCardForm = false;
      state.targetIdx = -1;
      state.createState = {
        defaultCategory: '',
      };
    },

    openCardDetail: (state, action: PayloadAction<{ targetIdx: number }>) => {
      state.isShowCardDetail = true;
      state.targetIdx = action.payload.targetIdx;
    },
    closeCardDetail: state => {
      state.isShowCardDetail = false;
      state.targetIdx = -1;
    },
  },
});

export const {
  openCreateCardForm,
  openCreateCardFormByPDF,
  closeCardForm,
  openCardDetail,
  closeCardDetail,
} = cardSlice.actions;

export default cardSlice.reducer;
