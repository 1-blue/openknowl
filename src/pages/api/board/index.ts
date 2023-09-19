import { boards } from '@/utils/dummy';

import type { Board, Override } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiCreateBoardResponse, ApiFindAllBoardsResponse } from '@/types/apis';

const handler = (
  req: Override<
    NextApiRequest,
    { body: Pick<Board, 'idx' | 'category' | 'title' | 'description'> }
  >,
  res: NextApiResponse<ApiCreateBoardResponse | ApiFindAllBoardsResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    return res.status(200).json({
      message: '모든 보드들을 가져왔습니다.',
      data: boards,
    });
  }
  // 보드 생성
  else if (method === 'POST') {
    const { category, title, description } = req.body;

    boards.push({
      idx: boards.length + 1,
      category,
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdBoard = boards[boards.length - 1];

    return res.status(201).json({
      message: `"${title}" 보드가 생성되었습니다.`,
      data: createdBoard,
    });
  }
};

export default handler;
