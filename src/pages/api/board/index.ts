import type { Board } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiCreateBoardResponse, ApiFindAllBoardsResponse } from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: Override<
    NextApiRequest,
    { body: Pick<Board, 'idx' | 'category' | 'title' | 'description'> }
  >,
  res: NextApiResponse<ApiCreateBoardResponse | ApiFindAllBoardsResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    const boards = await prisma.board.findMany({ orderBy: [{ order: 'asc' }] });

    return res.status(200).json({
      message: '모든 보드들을 가져왔습니다.',
      data: boards,
    });
  }
  // 보드 생성
  else if (method === 'POST') {
    const { category, title, description } = req.body;

    const count = await prisma.board.count({ where: { category } });

    const createdBoard = await prisma.board.create({
      data: {
        category,
        title,
        description,
        order: count,
      },
    });

    return res.status(201).json({
      message: `"${title}" 보드가 생성되었습니다.`,
      data: createdBoard,
    });
  }
};

export default handler;
