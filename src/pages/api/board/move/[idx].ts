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
      // 원래 순서보다 더 앞으로 간 경우
      if (order < exBoard.order) {
        // 원래 위치와 이동할 위치의 사이에 보드들만 변경 ( +1 )
        await prisma.board.updateMany({
          where: {
            category: { category },
            AND: [{ order: { lt: exBoard.order } }, { order: { gte: order } }],
          },
          data: { order: { increment: 1 } },
        });
      }
      // 원래 순서보다 더 뒤로 간 경우
      else {
        // 원래 위치와 이동할 위치의 사이에 보드들만 변경 ( -1 )
        await prisma.board.updateMany({
          where: {
            category: { category },
            AND: [{ order: { lte: order } }, { order: { gt: exBoard.order } }],
          },
          data: { order: { decrement: 1 } },
        });
      }
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
