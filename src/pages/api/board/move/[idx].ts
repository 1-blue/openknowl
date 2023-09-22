import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiMoveBoardRequest, ApiMoveBoardResponse } from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: Override<NextApiRequest, { query: { idx: string }; body: Omit<ApiMoveBoardRequest, 'idx'> }>,
  res: NextApiResponse<ApiMoveBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await prisma.board.findUnique({ where: { idx }, include: { category: true } });

  if (!exBoard) {
    return res.status(404).json({
      message: '존재하지 않는 보드입니다!',
    });
  }

  // 특정 보드 이동
  if (method === 'PATCH') {
    const { order, category } = req.body;

    // 다른 보드 이동인 경우
    if (category !== exBoard.category.category) {
      // 출발 보드 수정
      await prisma.board.updateMany({
        where: { order: { gt: exBoard.order }, categoryIdx: exBoard.categoryIdx },
        data: { order: { decrement: 1 } },
      });
      // 도착 보드 수정
      await prisma.board.updateMany({
        where: { order: { gte: order }, category: { category } },
        data: { order: { increment: 1 } },
      });
    }
    // 같은 보드 이동
    else {
      const targetBoard = await prisma.board.findFirst({
        where: { category: { category }, order },
      });
      if (!targetBoard) return;

      await Promise.allSettled([
        prisma.board.update({
          where: { idx: exBoard.idx },
          data: { order },
        }),
        prisma.board.update({
          where: { idx: targetBoard.idx },
          data: { order: exBoard.order },
        }),
      ]);
    }

    const updatedBoard = await prisma.board.update({
      where: { idx },
      data: { category: { connect: { category } }, order },
      include: { category: true },
    });

    return res.status(200).json({
      message: `"${exBoard.name}" 보드가 "${updatedBoard.category.category}"로 이동되었습니다.`,
      data: updatedBoard,
    });
  }
};

export default handler;
