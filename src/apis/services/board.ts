import prisma from '@/prisma';

import type { Prisma } from '@prisma/client';
import type {
  ApiFindAllBoardsRequest,
  ApiDeleteBoardRequest,
  ApiCreateBoardRequest,
  ApiUpdateBoardRequest,
  ApiMoveBoardRequest,
} from '@/types/apis';

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
      orderBy: { order: 'asc' },
      include: {
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
    const exBoard = await prisma.board.findUnique({ where: { category } });

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

    // TODO: 순서 값 조정 필요

    return deletedBoard;
  },
  /** 2023/10/07 - 모든 보드 개수 - by 1-blue */
  async count() {
    const count = await prisma.board.count();

    return count;
  },
  /** 2023/10/07 - 보드 생성 - by 1-blue */
  async create({ category }: ApiCreateBoardRequest) {
    const count = await this.count();

    const createdBoard = await prisma.board.create({
      data: { category, order: count },
      include: { cards: { include: { platform: true, tags: true } } },
    });

    return createdBoard;
  },
  /** 2023/10/07 - 보드 수정 - by 1-blue */
  async update({ currentCategory, category }: ApiUpdateBoardRequest) {
    const updatedBoard = await prisma.board.update({
      where: { category: currentCategory },
      data: { category },
      include: { cards: { include: { platform: true, tags: true } } },
    });

    return updatedBoard;
  },
  /** 2023/10/07 - 보드의 카테고리들 찾기 - by 1-blue */
  async findManyCategoryOfBoard() {
    const boards = await this.findMany({});

    return boards.map(board => board.category);
  },
  /** 2023/10/08 - 보드 이동 - by 1-blue */
  async move({ idx, sourceOrder, destinationOrder }: ApiMoveBoardRequest) {
    // 원래 위치보다 뒤로 이동하는 경우
    if (sourceOrder < destinationOrder) {
      await prisma.board.updateMany({
        where: { AND: [{ order: { gt: sourceOrder } }, { order: { lte: destinationOrder } }] },
        data: { order: { decrement: 1 } },
      });
    }
    // 원래 위치보다 앞으로 이동하는 경우
    else {
      await prisma.board.updateMany({
        where: { AND: [{ order: { lt: sourceOrder } }, { order: { gte: destinationOrder } }] },
        data: { order: { increment: 1 } },
      });
    }

    const updatedBoard = await prisma.board.update({
      where: { idx },
      data: { order: destinationOrder },
      include: { cards: { include: { platform: true, tags: true } } },
    });

    return updatedBoard;
  },
};
