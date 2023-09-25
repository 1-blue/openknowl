import type { ApiResponse } from '..';
import type { PresignedPost } from '@aws-sdk/s3-presigned-post';

/** 2023/09/23 - PDF를 업로드할 presignedURL 요청 타입 - by 1-blue */
export interface ApiCreatePresignedURLRequest {
  name: string;
}
/** 2023/09/23 - PDF를 업로드할 presignedURL 응답 타입 - by 1-blue */
export interface ApiCreatePresignedURLResponse extends ApiResponse<PresignedPost> {}
