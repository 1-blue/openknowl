import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiFindAllBoardsRequest, ApiFindAllBoardsResponse } from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { query: ApiFindAllBoardsRequest }>,
  res: NextApiResponse<ApiFindAllBoardsResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    const { platform, tag } = req.query;

    const boards = await boardService.findMany({ platform, tag });

    return res.status(200).json({ data: boards });
  }
};

export default handler;
