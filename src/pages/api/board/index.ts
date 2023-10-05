import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiCreateBoardRequest,
  ApiCreateBoardResponse,
  ApiFindAllBoardsRequest,
  ApiFindAllBoardsResponse,
} from '@/types/apis';

/**
 * @swagger
 * /api/board:
 *  get:
 *    summary: 모든 보드들 요청
 *    description: 모든 보드들 요청
 *    parameters:
 *      - in: query
 *        name: 플랫폼
 *        schema:
 *          type: string
 *        description: ex) 미니인턴 & 원티드 & 잡코리아 & 로켓펀치 & 사람인
 *      - in: query
 *        name: 태그
 *        schema:
 *          type: string
 *        description: ex) \#연봉협상,\#면접,\#시니어,\#오픈놀,\#기업과제,\#태그
 *    responses:
 *      200:
 *        description: 모든 보드들 응답
 *  post:
 *    summary: 보드 생성
 *    description: 보드 생성
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
 *            name: Swagger 테스트
 *            date: 2023-12-31T23:59
 *            category: 검토
 *            platform: 미니인턴
 *            tags: ['#미니인턴', '#면접', '#기업과제']
 *            pdf: https://bleplayground.s3.ap-northeast-2.amazonaws.com/test.pdf
 *    responses:
 *      201:
 *        description: 보드 생성 완료
 */
const handler = async (
  req: Override<
    NextApiRequest,
    {
      body: ApiCreateBoardRequest;
      query: ApiFindAllBoardsRequest;
    }
  >,
  res: NextApiResponse<ApiCreateBoardResponse | ApiFindAllBoardsResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    const { platform, tag } = req.query;

    const boardsGroup = await boardService.findMany({ platform, tag });

    return res.status(200).json({ data: boardsGroup });
  }
  // 보드 생성
  else if (method === 'POST') {
    const { name } = req.body;

    const createdBoard = await boardService.create(req.body);

    return res
      .status(201)
      .json({ message: `"${name}" 보드가 생성되었습니다.`, data: createdBoard });
  }
};

export default handler;
