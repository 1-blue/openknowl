import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiDeleteBoardResponse,
  ApiFindOneBoardResponse,
  ApiUpdateBoardRequest,
  ApiUpdateBoardResponse,
} from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: Override<NextApiRequest, { query: { idx: string }; body: ApiUpdateBoardRequest }>,
  res: NextApiResponse<ApiFindOneBoardResponse | ApiUpdateBoardResponse | ApiDeleteBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await prisma.board.findUnique({
    where: { idx },
    include: { category: true, platform: true, tags: true },
  });

  if (!exBoard) {
    return res.status(404).json({
      message: '존재하지 않는 보드입니다!',
    });
  }

  // 특정 보드 찾기
  if (method === 'GET') {
    res.status(200).json({
      data: exBoard,
    });
  }
  // 특정 보드 수정
  else if (method === 'PATCH') {
    const { category, platform, idx: _, date, tags, ...rest } = req.body;

    // 다른 카테고리로 이동한 경우
    if (category !== exBoard.category.category) {
      // 출발 보드 수정
      await prisma.board.updateMany({
        where: { order: { gt: exBoard.order }, categoryIdx: exBoard.categoryIdx },
        data: { order: { decrement: 1 } },
      });

      const count = await prisma.board.count({ where: { category: { category } } });

      await prisma.board.update({
        where: { idx },
        data: { order: count },
      });
    }

    // FIXME: 태그 다 끊고 다시 연결
    await prisma.board.update({
      where: { idx },
      data: { tags: { set: [] } },
    });

    const updatedBoard = await prisma.board.update({
      where: { idx },
      data: {
        ...rest,
        date: new Date(date),
        category: { connect: { category } },
        platform: { connect: { platform } },
        tags: { connectOrCreate: tags.map(tag => ({ where: { tag }, create: { tag } })) },
      },
    });

    return res.status(200).json({
      message: `"${exBoard.name}" 보드가 수정되었습니다.`,
      data: updatedBoard,
    });
  }
  // 특정 보드 삭제
  else if (method === 'DELETE') {
    const removedBoard = await prisma.board.delete({ where: { idx } });

    // 순서 변경
    await prisma.board.updateMany({
      where: { order: { gt: exBoard.order }, categoryIdx: exBoard.categoryIdx },
      data: { order: { decrement: 1 } },
    });

    return res.status(200).json({
      message: `"${removedBoard.name}" 보드를 제거했습니다.`,
      data: removedBoard,
    });
  }
};

export default handler;
