import type { Board, Card, Platform, Tag } from '@prisma/client';
import type { ApiResponse } from '..';

export interface CardWithETC extends Card {
  tags: Tag[];
  platform: Platform;
  board: Board;
}

/** 2023/09/18 - 특정 카드 요청 타입 - by 1-blue */
export interface ApiFindOneCardRequest {
  idx: number;
}
/** 2023/09/18 - 특정 카드 응답 타입 - by 1-blue */
export interface ApiFindOneCardResponse extends ApiResponse<CardWithETC> {}

/** 2023/09/18 - 특정 카드 생성 요청 타입 - by 1-blue */
export interface ApiCreateCardRequest extends Pick<Card, 'name' | 'date' | 'pdf'> {
  platform: string;
  tags: string[];
  category: string;
}
/** 2023/09/18 - 특정 카드 생성 응답 타입 - by 1-blue */
export interface ApiCreateCardResponse extends ApiResponse<CardWithETC> {}

/** 2023/09/18 - 특정 카드 수정 요청 타입 - by 1-blue */
export interface ApiUpdateCardRequest extends Pick<Card, 'name' | 'date' | 'pdf'> {
  idx: number;
  category: string;
  platform: string;
  tags: string[];
}
/** 2023/09/18 - 특정 카드 수정 응답 타입 - by 1-blue */
export interface ApiUpdateCardResponse extends ApiResponse<CardWithETC> {}

/** 2023/09/18 - 특정 카드 제거 요청 타입 - by 1-blue */
export interface ApiDeleteCardRequest {
  idx: number;
}
/** 2023/09/18 - 특정 카드 제거 응답 타입 - by 1-blue */
export interface ApiDeleteCardResponse extends ApiResponse<Card> {}

/** 2023/09/19 - 특정 카드 이동 요청 타입 - by 1-blue */
export interface ApiMoveCardRequest {
  idx: number;
  sourceBoardIdx: number;
  sourceOrder: number;
  destinationBoardIdx: number;
  destinationOrder: number;
}
/** 2023/09/19 - 특정 카드 이동 응답 타입 - by 1-blue */
export interface ApiMoveCardResponse extends ApiResponse<Card> {}

/** 2023/09/26 - 카드의 태그 리스트 요청 타입 - by 1-blue */
export interface ApiFindAllTagsOfCardRequest {}
/** 2023/09/26 - 카드의 태그 리스트 응답 타입 - by 1-blue */
export interface ApiFindAllTagsOfCardResponse extends ApiResponse<Tag[]> {}
