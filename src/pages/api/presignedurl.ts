import { presignedurlService } from '@/apis/services/presignedurl';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiCreatePresignedURLRequest, ApiCreatePresignedURLResponse } from '@/types/apis';

// TODO: swagger
const handler = async (
  req: Override<NextApiRequest, { body: ApiCreatePresignedURLRequest }>,
  res: NextApiResponse<ApiCreatePresignedURLResponse>,
) => {
  const { method } = req;

  // 서명된 URL 요청
  if (method === 'POST') {
    const { name } = req.body;

    const data = await presignedurlService.create({ name });

    return res.status(200).json({
      message: 'PDF를 업로드할 수 있는 서명된 URL을 생성했습니다.',
      data,
    });
  }
};

export default handler;
