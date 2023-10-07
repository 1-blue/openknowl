import type { Platform } from '@prisma/client';
import type { ApiResponse } from '..';

/** 2023/09/22 - 카드의 플랫폼 리스트 요청 타입 - by 1-blue */
export interface ApiFindAllPlatformsOfCardRequest {}
/** 2023/09/22 - 카드의 플랫폼 리스트 응답 타입 - by 1-blue */
export interface ApiFindAllPlatformsOfCardResponse extends ApiResponse<Platform[]> {}
