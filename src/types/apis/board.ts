import type { Board, Category } from '@prisma/client';
import type { ApiResponse } from '..';
import type { CardWithETC } from './card';

interface BoardWithETC extends Board {
  category: Category | null;
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
