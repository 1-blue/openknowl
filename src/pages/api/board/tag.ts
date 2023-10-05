import { tagService } from '@/apis/services/tag';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiFindAllTagsOfBoardResponse } from '@/types/apis';

/**
 * @swagger
 * /api/board/tag:
 *  get:
 *    summary: 등록된 모든 태그 요청
 *    description: 등록된 모든 태그 요청
 *    responses:
 *      200:
 *        description: 등록된 모든 태그 응답
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiFindAllTagsOfBoardResponse>,
) => {
  const { method } = req;

  // 모든 태그 찾기
  if (method === 'GET') {
    const tags = await tagService.findAll();

    return res.status(200).json({ data: tags });
  }
};

export default handler;
