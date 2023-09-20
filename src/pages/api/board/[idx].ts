import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiDeleteBoardResponse,
  ApiFindOneBoardResponse,
  ApiUpdateBoardResponse,
} from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: Override<NextApiRequest, { query: { idx: string } }>,
  res: NextApiResponse<ApiFindOneBoardResponse | ApiUpdateBoardResponse | ApiDeleteBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await prisma.board.findUnique({ where: { idx } });

  if (!exBoard) {
    return res.status(404).json({
      message: '존재하지 않는 보드입니다!',
    });
  }

  // 특정 보드 찾기
  if (method === 'GET') {
    res.status(200).json({
      message: `"${exBoard.title}" 보드를 찾았습니다.`,
      data: exBoard,
    });
  }
  // 특정 보드 수정
  else if (method === 'PATCH') {
    const { category, title, description } = req.body;

    const updatedBoard = await prisma.board.update({
      where: { idx },
      data: { category, title, description },
    });

    return res.status(200).json({
      message: `"${exBoard.title}" 보드가 수정되었습니다.`,
      data: updatedBoard,
    });
  }
  // 특정 보드 삭제
  else if (method === 'DELETE') {
    const removedBoard = await prisma.board.delete({ where: { idx } });

    return res.status(200).json({
      message: `"${removedBoard.title}" 보드를 제거했습니다.`,
      data: removedBoard,
    });
  }
};

export default handler;
