import type { Category } from '@/types';

type BoardTable = {
  [key in Category]: string;
};
/** 2023/09/19 - 영어와 한글 이름 테이블 - by 1-blue */
export const boardCategoryNameTable: BoardTable = {
  new: '신규',
  review: '검토',
  firstInterview: '1차면접',
  secondInterview: '2차면접',
  documentPass: '서류합격',
  finalPass: '최종합격',
  failure: '불합격',
};
/** 2023/09/19 - 카테고리와 색상 테이블 - by 1-blue */
export const boardCategoryColorTable: BoardTable = {
  new: '#fed7aa',
  review: '#fef08a',
  firstInterview: '#bbf7d0',
  secondInterview: '#99f6e4',
  documentPass: '#93c5fd',
  finalPass: '#c7d2fe',
  failure: '#fecdd3',
};
