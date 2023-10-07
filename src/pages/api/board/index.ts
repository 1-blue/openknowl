import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiCreateBoardRequest,
  ApiCreateBoardResponse,
  ApiFindAllBoardsRequest,
  ApiFindAllBoardsResponse,
} from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { query: ApiFindAllBoardsRequest; body: ApiCreateBoardRequest }>,
  res: NextApiResponse<ApiFindAllBoardsResponse | ApiCreateBoardResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    const { platform, tag } = req.query;

    const boards = await boardService.findMany({ platform, tag });

    return res.status(200).json({ data: boards });
  }
  // 보드 생성
  if (method === 'POST') {
    const { category } = req.body;

    const createdBoard = await boardService.create({ category });

    return res
      .status(201)
      .json({ message: `"${category}" 보드가 생성되었습니다.`, data: createdBoard });
  }
};

export default handler;
