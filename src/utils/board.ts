import { Category, Platform } from '@prisma/client';

type BoardTable = {
  [key in Category]: string;
};
/** 2023/09/19 - 영어와 한글 이름 테이블 - by 1-blue */
export const boardCategoryNameTable: BoardTable = {
  NEW: '신규',
  REVIEW: '검토',
  FIRST_INTERVIEW: '1차면접',
  SECOND_INTERVIEW: '2차면접',
  DOCUMENT_PASS: '서류합격',
  FINAL_PASS: '최종합격',
  FAILURE: '불합격',
};
/** 2023/09/19 - 카테고리와 색상 테이블 - by 1-blue */
export const boardCategoryColorTable: BoardTable = {
  NEW: '#fed7aa',
  REVIEW: '#fef08a',
  FIRST_INTERVIEW: '#bbf7d0',
  SECOND_INTERVIEW: '#99f6e4',
  DOCUMENT_PASS: '#93c5fd',
  FINAL_PASS: '#c7d2fe',
  FAILURE: '#fecdd3',
};
/** 2023/09/20 - 카테고리들 - by 1-blue */
export const categories: Category[] = [
  'NEW',
  'REVIEW',
  'FIRST_INTERVIEW',
  'SECOND_INTERVIEW',
  'DOCUMENT_PASS',
  'FINAL_PASS',
  'FAILURE',
];
type PlatformTable = {
  [key in Platform]: string;
};
/** 2023/09/20 - 플렛폼 언어 테이블 - by 1-blue */
export const platformNameTable: PlatformTable = {
  WANTED: '원티드',
  SARAMIN: '사람인',
  ROCKETPUNCH: '로켓펀치',
  MINIINTERN: '미니인턴',
  JOBPLANET: '잡플래닛',
};
