import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiDeleteBoardRequest,
  ApiDeleteBoardResponse,
  ApiFindOneBoardResponse,
  ApiUpdateBoardRequest,
  ApiUpdateBoardResponse,
} from '@/types/apis';

/**
 * @swagger
 * /api/board/{idx}:
 *  get:
 *    summary: 특정 보드 요청
 *    description: 특정 보드 요청
 *    parameters:
 *      - in: path
 *        name: idx
 *        required: true
 *        schema:
 *          type: integer
 *        description: ex) 1
 *    responses:
 *      200:
 *        description: 특정 보드 응답
 *      404:
 *        description: 존재하지 않는 보드
 *  patch:
 *    summary: 특정 보드 수정 요청
 *    description: 특정 보드 수정 요청
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
 *            name: string
 *            date: date
 *            category: string
 *            platform: string
 *            tags: array
 *            pdf: string
 *          example:
 *            name: Swagger 수정
 *            date: 2023-12-31T23:59
 *            category: 검토
 *            platform: 미니인턴
 *            tags: ['#미니인턴', '#면접', '#기업과제']
 *            pdf: https://bleplayground.s3.ap-northeast-2.amazonaws.com/test.pdf
 *    responses:
 *      200:
 *        description: 특정 보드 수정 완료
 *      404:
 *        description: 존재하지 않는 보드
 *  delete:
 *    summary: 특정 보드 제거 요청
 *    description: 특정 보드 제거 요청
 *    parameters:
 *      - in: path
 *        name: idx
 *        required: true
 *        schema:
 *          type: integer
 *        description: ex) 1
 *    responses:
 *      200:
 *        description: 특정 보드 제거 성공
 *      404:
 *        description: 존재하지 않는 보드
 */
const handler = async (
  req: Override<NextApiRequest, { query: ApiDeleteBoardRequest; body: ApiUpdateBoardRequest }>,
  res: NextApiResponse<ApiFindOneBoardResponse | ApiUpdateBoardResponse | ApiDeleteBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await boardService.findOne({ idx });

  if (!exBoard) return res.status(404).json({ message: '존재하지 않는 보드입니다!' });

  // 특정 보드 찾기
  if (method === 'GET') {
    return res.status(200).json({ data: exBoard });
  }
  // 특정 보드 수정
  else if (method === 'PATCH') {
    const updatedBoard = await boardService.update({ exBoard, ...req.body });

    return res.status(200).json({
      message: `"${exBoard.name}" 보드가 수정되었습니다.`,
      data: updatedBoard,
    });
  }
  // 특정 보드 삭제
  else if (method === 'DELETE') {
    const deletedBoard = await boardService.delete({ exBoard, idx });

    return res.status(200).json({
      message: `"${deletedBoard.name}" 보드를 제거했습니다.`,
      data: deletedBoard,
    });
  }
};

export default handler;
