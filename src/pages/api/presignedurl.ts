import { S3 } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiCreatePresignedURLRequest, ApiCreatePresignedURLResponse } from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { body: ApiCreatePresignedURLRequest }>,
  res: NextApiResponse<ApiCreatePresignedURLResponse>,
) => {
  const { method } = req;

  // 서명된 URL 요청
  if (method === 'POST') {
    const { name } = req.body;

    // S3 연결
    const client = new S3({
      region: process.env['AWS_S3_REGION'],
      credentials: {
        accessKeyId: process.env['AWS_S3_ACCESS_KEY'],
        secretAccessKey: process.env['AWS_S3_ACCESS_SECRET_KEY'],
      },
    });

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

    return res.status(200).json({
      message: 'PDF를 업로드할 수 있는 서명된 URL을 생성했습니다.',
      data,
    });
  }
};

export default handler;
