import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiCreateBoardRequest,
  ApiCreateBoardResponse,
  ApiFindAllBoardsResponse,
  ApiUpdateBoardRequest,
} from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: Override<NextApiRequest, { body: ApiCreateBoardRequest | ApiUpdateBoardRequest }>,
  res: NextApiResponse<ApiCreateBoardResponse | ApiFindAllBoardsResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    const categories = await prisma.category.findMany();

    const boardsGroup = await Promise.all(
      categories.map(({ idx }) =>
        prisma.board.findMany({
          where: { category: { idx } },
          orderBy: [{ order: 'asc' }],
          include: { category: true, platform: true, tags: true },
        }),
      ),
    );

    return res.status(200).json({
      data: boardsGroup,
    });
  }
  // 보드 생성
  else if (method === 'POST') {
    const { name, date, category, platform, tags, pdf } = req.body;

    const count = await prisma.board.count({ where: { category: { category } } });

    const createdBoard = await prisma.board.create({
      data: {
        name,
        date: new Date(date),
        order: count,
        category: { connect: { category } },
        platform: { connect: { platform } },
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { tag },
            create: { tag },
          })),
        },
        pdf,
      },
      include: {
        tags: true,
      },
    });

    return res.status(201).json({
      message: `"${name}" 보드가 생성되었습니다.`,
      data: createdBoard,
    });
  }
};

export default handler;
