import type { Category } from '@prisma/client';
import type { ApiResponse } from '..';

/** 2023/09/22 - 카드의 카테고리 리스트 요청 타입 - by 1-blue */
export interface ApiFindAllCategoriesOfCardRequest {}
/** 2023/09/22 - 카드의 카테고리 리스트 응답 타입 - by 1-blue */
export interface ApiFindAllCategoriesOfCardResponse extends ApiResponse<Category[]> {}
