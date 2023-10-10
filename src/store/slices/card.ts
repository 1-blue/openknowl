import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CardState {
  /** 카드 생성 폼을 보여줄지 여부 */
  isOpenCardForm: boolean;
  /** 카드 상세 보기 모달을 보여줄지 여부 */
  isOpenCardDetail: boolean;

  createState: {
    /** 카드가 생성될 보드의 기본 카테고리 */
    defaultCategory: string;
    /** Drag & Drop으로 PDF를 업로드하는 경우 나머지 내용을 작성하는 동안 저장될 파일 */
    pdfFile?: File;
  };
  updateState: {
    /** 수정할 카드의 식별자 */
    targetIdx: number;
  };
  detailState: {
    /** 상세 보기를 할 카드의 식별자 */
    targetIdx: number;
  };
}

const initialState: CardState = {
  isOpenCardForm: false,
  isOpenCardDetail: false,

  createState: {
    defaultCategory: '',
  },
  updateState: {
    targetIdx: -1,
  },
  detailState: {
    targetIdx: -1,
  },
};

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    /** 일반 카드 생성 폼 열기 */
    openCreateCardForm: (state, action: PayloadAction<{ defaultCategory: string }>) => {
      state.isOpenCardForm = true;
      state.createState.defaultCategory = action.payload.defaultCategory;
    },
    /** `PDF Drag & Drop`으로 카드 생성 폼 열기 */
    openCreateCardFormByPDF: (state, action: PayloadAction<{ pdfFile: File }>) => {
      state.isOpenCardForm = true;
      state.createState.pdfFile = action.payload.pdfFile;
    },
    /** 카드 수정 폼 열기 */
    openUpdateCardForm: (state, action: PayloadAction<{ targetIdx: number }>) => {
      state.isOpenCardForm = true;
      state.updateState.targetIdx = action.payload.targetIdx;
    },
    /** 카드 생성 & 수정 폼 닫기 */
    closeCardForm: state => {
      state.isOpenCardForm = false;
      state.createState = { defaultCategory: '' };
      state.updateState = { targetIdx: -1 };
    },
    /** 카드 상세 보기 모달 열기 */
    openCardDetail: (state, action: PayloadAction<{ targetIdx: number }>) => {
      state.isOpenCardDetail = true;
      state.detailState.targetIdx = action.payload.targetIdx;
    },
    /** 카드 상세 보기 모달 닫기 */
    closeCardDetail: state => {
      state.isOpenCardDetail = false;
      state.detailState.targetIdx = -1;
    },
  },
});

export const {
  openCreateCardForm,
  openCreateCardFormByPDF,
  openUpdateCardForm,
  closeCardForm,
  openCardDetail,
  closeCardDetail,
} = cardSlice.actions;

export default cardSlice.reducer;
