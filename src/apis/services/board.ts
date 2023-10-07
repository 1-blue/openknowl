import prisma from '@/prisma';

import type { Prisma } from '@prisma/client';
import type { ApiFindAllBoardsRequest, ApiDeleteBoardRequest } from '@/types/apis';

export const boardService = {
  /** 2023/10/06 - 모드 보드 찾기 - by 1-blue */
  async findMany({ platform, tag }: ApiFindAllBoardsRequest) {
    const where: Prisma.CardFindManyArgs = {
      where: {
        ...(platform && {
          platform: { platform: { equals: platform } },
        }),
        ...(tag && {
          tags: { some: { tag: { in: tag.split(',') } } },
        }),
      },
    };

    const boards = await prisma.board.findMany({
      include: {
        category: true,
        cards: {
          include: { platform: true, tags: true },
          where: { ...where.where },
          orderBy: { order: 'asc' },
        },
      },
    });

    return boards;
  },
  /** 2023/10/06 - 카테고리로 특정 보드 찾기 - by 1-blue */
  async findOneByCategory({ category }: { category: string }) {
    const exBoard = await prisma.board.findFirst({ where: { category: { category } } });

    return exBoard;
  },
  /** 2023/10/07 - 특정 보드 찾기 - by 1-blue */
  async findOne({ idx }: { idx: number }) {
    const exBoard = await prisma.board.findUnique({ where: { idx } });

    return exBoard;
  },
  /** 2023/10/07 - 보드 제거 - by 1-blue */
  async delete({ idx }: ApiDeleteBoardRequest) {
    const deletedBoard = await prisma.board.delete({ where: { idx } });

    return deletedBoard;
  },
};
