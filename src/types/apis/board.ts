import type { Board, Category } from '@prisma/client';
import type { ApiResponse } from '..';

/** 2023/09/18 - 특정 보드 요청 타입 - by 1-blue */
export interface ApiFindOneBoardRequest {
  idx: number;
}
/** 2023/09/18 - 특정 보드 응답 타입 - by 1-blue */
export interface ApiFindOneBoardResponse extends ApiResponse<Board> {}

/** 2023/09/18 - 모든 보드 요청 타입 - by 1-blue */
export interface ApiFindAllBoardsRequest {}
/** 2023/09/18 - 모든 보드 응답 타입 - by 1-blue */
export interface ApiFindAllBoardsResponse extends ApiResponse<Board[]> {}

/** 2023/09/18 - 특정 보드 생성 요청 타입 - by 1-blue */
export interface ApiCreateBoardRequest extends Pick<Board, 'category' | 'title' | 'description'> {}
/** 2023/09/18 - 특정 보드 생성 응답 타입 - by 1-blue */
export interface ApiCreateBoardResponse extends ApiResponse<Board> {}

/** 2023/09/18 - 특정 보드 수정 요청 타입 - by 1-blue */
export interface ApiUpdateBoardRequest extends Pick<Board, 'category' | 'title' | 'description'> {
  idx: number;
}
/** 2023/09/18 - 특정 보드 수정 응답 타입 - by 1-blue */
export interface ApiUpdateBoardResponse extends ApiResponse<Board> {}

/** 2023/09/18 - 특정 보드 제거 요청 타입 - by 1-blue */
export interface ApiDeleteBoardRequest {
  idx: number;
}
/** 2023/09/18 - 특정 보드 제거 응답 타입 - by 1-blue */
export interface ApiDeleteBoardResponse extends ApiResponse<Board> {}

/** 2023/09/19 - 특정 보드 이동 요청 타입 - by 1-blue */
export interface ApiMoveBoardRequest {
  idx: number;
  order: number;
  category: Category;
}
/** 2023/09/19 - 특정 보드 이동 응답 타입 - by 1-blue */
export interface ApiMoveBoardResponse extends ApiResponse<Board> {}
