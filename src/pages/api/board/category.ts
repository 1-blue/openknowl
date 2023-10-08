import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/category:
 *  get:
 *    summary: 등록된 모든 카테고리 요청
 *    description: 등록된 모든 카테고리 요청
 *    responses:
 *      200:
 *        description: 등록된 모든 카테고리 응답
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  // 모든 카테고리 찾기
  if (method === 'GET') {
    const categories = await boardService.findManyCategoryOfBoard();

    return res.status(200).json({ data: categories });
  }
};

export default handler;
