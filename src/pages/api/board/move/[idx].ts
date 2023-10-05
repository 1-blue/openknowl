import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiMoveBoardRequest, ApiMoveBoardResponse } from '@/types/apis';

/**
 * @swagger
 * /api/board/move/{idx}:
 *  patch:
 *    summary: 특정 보드 이동 요청
 *    description: 특정 보드 이동 요청
 *    parameters:
 *      - in: path
 *        name: idx
 *        required: true
 *        schema:
 *          type: integer
 *        description: ex) 1
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            order: integer
 *            category: string
 *          example:
 *            order: 1
 *            category: 신규
 *    responses:
 *      200:
 *        description: 특정 보드 이동 성공
 *      404:
 *        description: 존재하지 않는 보드
 */
const handler = async (
  req: Override<NextApiRequest, { query: { idx: string }; body: Omit<ApiMoveBoardRequest, 'idx'> }>,
  res: NextApiResponse<ApiMoveBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await boardService.findOne({ idx });

  if (!exBoard) return res.status(404).json({ message: '존재하지 않는 보드입니다!' });

  // 특정 보드 이동
  if (method === 'PATCH') {
    const updatedBoard = await boardService.move({ exBoard, ...req.body, idx });

    return res.status(200).json({
      message: `"${exBoard.name}" 보드가 "${updatedBoard.category.category}"로 이동되었습니다.`,
      data: updatedBoard,
    });
  }
};

export default handler;
