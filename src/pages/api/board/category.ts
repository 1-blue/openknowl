import { categoryService } from '@/apis/services/category';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiFindAllCategoriesOfBoardResponse } from '@/types/apis';

/**
 * @swagger
 * /api/board/category:
 *  get:
 *    summary: 등록된 모든 카테고리 요청
 *    description: 등록된 모든 카테고리 요청
 *    responses:
 *      200:
 *        description: 등록된 모든 카테고리 응답
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiFindAllCategoriesOfBoardResponse>,
) => {
  const { method } = req;

  // 모든 카테고리 찾기
  if (method === 'GET') {
    const categories = await categoryService.findAll();

    return res.status(200).json({ data: categories });
  }
};

export default handler;
