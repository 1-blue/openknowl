import type { Board } from '@prisma/client';
import type { ApiResponse } from '..';
import type { CardWithETC } from './card';

interface BoardWithETC extends Board {
  cards: CardWithETC[];
}

/** 2023/10/06 - 모든 보드 요청 타입 - by 1-blue */
export interface ApiFindAllBoardsRequest {
  platform?: string;
  tag?: string;
}
/** 2023/10/06 - 모든 보드 응답 타입 - by 1-blue */
export interface ApiFindAllBoardsResponse extends ApiResponse<BoardWithETC[]> {}

/** 2023/10/06 - 특정 보드 요청 타입 - by 1-blue */
export interface ApiFindOneBoardRequest {
  idx: number;
}
/** 2023/10/06 - 특정 보드 응답 타입 - by 1-blue */
export interface ApiFindOneBoardResponse extends ApiResponse<BoardWithETC> {}

/** 2023/10/07 - 특정 보드 제거 요청 타입 - by 1-blue */
export interface ApiDeleteBoardRequest {
  idx: number;
}
/** 2023/10/07 - 특정 보드 제거 응답 타입 - by 1-blue */
export interface ApiDeleteBoardResponse extends ApiResponse<Board> {}

/** 2023/10/07 - 보드 생성 요청 타입 - by 1-blue */
export interface ApiCreateBoardRequest {
  category: string;
}
/** 2023/10/07 - 보드 생성 응답 타입 - by 1-blue */
export interface ApiCreateBoardResponse extends ApiResponse<BoardWithETC> {}

/** 2023/10/07 - 보드 수정 요청 타입 - by 1-blue */
export interface ApiUpdateBoardRequest {
  idx: number;
  currentCategory: string;
  category: string;
}
/** 2023/10/07 - 보드 수정 응답 타입 - by 1-blue */
export interface ApiUpdateBoardResponse extends ApiResponse<BoardWithETC> {}

/** 2023/10/08 - 보드의 모든 카테고리들 요청 타입 - by 1-blue */
export interface ApiFindAllCategoryOfBoardRequest {}
/** 2023/10/07 - 보드의 모든 카테고리들 응답 타입 - by 1-blue */
export interface ApiFindAllCategoryOfBoardResponse extends ApiResponse<string[]> {}
