import { platformService } from '@/apis/services/platform';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiFindAllPlatformsOfBoardResponse } from '@/types/apis';

/**
 * @swagger
 * /api/board/platform:
 *  get:
 *    summary: 등록된 모든 플랫폼 요청
 *    description: 등록된 모든 플랫폼 요청
 *    responses:
 *      200:
 *        description: 등록된 모든 플랫폼 응답
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiFindAllPlatformsOfBoardResponse>,
) => {
  const { method } = req;

  // 모든 플랫폼 찾기
  if (method === 'GET') {
    const platforms = await platformService.findAll();

    return res.status(200).json({ data: platforms });
  }
};

export default handler;
