import type { Board, Category, Platform, Tag } from '@prisma/client';
import type { ApiResponse } from '..';

export interface BoardWithETC extends Board {
  category: Category;
  platform: Platform;
  tags: Tag[];
}

/** 2023/09/18 - 특정 보드 요청 타입 - by 1-blue */
export interface ApiFindOneBoardRequest {
  idx: number;
}
/** 2023/09/18 - 특정 보드 응답 타입 - by 1-blue */
export interface ApiFindOneBoardResponse extends ApiResponse<BoardWithETC> {}

/** 2023/09/18 - 모든 보드 요청 타입 - by 1-blue */
export interface ApiFindAllBoardsRequest {}
/** 2023/09/18 - 모든 보드 응답 타입 - by 1-blue */
export interface ApiFindAllBoardsResponse extends ApiResponse<BoardWithETC[][]> {}

/** 2023/09/18 - 특정 보드 생성 요청 타입 - by 1-blue */
export interface ApiCreateBoardRequest extends Pick<Board, 'name' | 'date'> {
  category: string;
  platform: string;
  tags: string[];
}
/** 2023/09/18 - 특정 보드 생성 응답 타입 - by 1-blue */
export interface ApiCreateBoardResponse extends ApiResponse<Board> {}

/** 2023/09/18 - 특정 보드 수정 요청 타입 - by 1-blue */
export interface ApiUpdateBoardRequest extends Pick<Board, 'name' | 'date'> {
  idx: number;
  category: string;
  platform: string;
  tags: string[];
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
  category: string;
}
/** 2023/09/19 - 특정 보드 이동 응답 타입 - by 1-blue */
export interface ApiMoveBoardResponse extends ApiResponse<Board> {}

/** 2023/09/22 - 보드의 카테고리 리스트 요청 타입 - by 1-blue */
export interface ApiFindAllCategoriesOfBoardRequest {}
/** 2023/09/22 - 보드의 카테고리 리스트 응답 타입 - by 1-blue */
export interface ApiFindAllCategoriesOfBoardResponse extends ApiResponse<Category[]> {}

/** 2023/09/22 - 보드의 플랫폼 리스트 요청 타입 - by 1-blue */
export interface ApiFindAllPlatformsOfBoardRequest {}
/** 2023/09/22 - 보드의 플랫폼 리스트 응답 타입 - by 1-blue */
export interface ApiFindAllPlatformsOfBoardResponse extends ApiResponse<Platform[]> {}
