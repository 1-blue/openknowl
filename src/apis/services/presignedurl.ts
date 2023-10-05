import { S3 } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

import type { ApiCreatePresignedURLRequest } from '@/types/apis';

export const presignedurlService = {
  /** 2023/10/05 - presignedurl 생성 - by 1-blue */
  async create({ name }: ApiCreatePresignedURLRequest) {
    // S3 연결
    const client = new S3({
      region: process.env['AWS_S3_REGION'],
      credentials: {
        accessKeyId: process.env['AWS_S3_ACCESS_KEY'],
        secretAccessKey: process.env['AWS_S3_ACCESS_SECRET_KEY'],
      },
    });

    // 파일 이름과 확장자 분리
    const [filename, ext] = name.split('.');

    // POST로 요청해야하는 presignedURL 생성
    const data = await createPresignedPost(client, {
      Bucket: process.env['AWS_S3_BUCKET'],
      Key: `${process.env['NODE_ENV']}/pdf/` + `${filename}_${Date.now()}.${ext}`,
      Expires: 60,
      Conditions: [
        ['content-length-range', 0, 50 * 1024 ** 2],
        ['starts-with', '$Content-Type', 'application/pdf'],
      ],
    });

    return data;
  },
};
