import prisma from '@/prisma';

import type { Prisma } from '@prisma/client';
import type {
  ApiFindAllBoardsRequest,
  ApiCreateBoardRequest,
  ApiUpdateBoardRequest,
  ApiDeleteBoardRequest,
  ApiMoveBoardRequest,
  BoardWithETC,
} from '@/types/apis';

export const boardService = {
  /** 2023/10/05 - 모드 보드 찾기 - by 1-blue */
  async findMany({ platform, tag }: ApiFindAllBoardsRequest) {
    const where: Prisma.BoardFindManyArgs = {
      where: {
        ...(platform && {
          platform: { platform: { equals: platform } },
        }),
        ...(tag && {
          tags: { some: { tag: { in: tag.split(',') } } },
        }),
      },
    };

    const categories = await prisma.category.findMany();

    const boardsGroup = await Promise.all(
      categories.map(({ idx }) =>
        prisma.board.findMany({
          where: { category: { idx }, ...where.where },
          orderBy: [{ order: 'asc' }],
          include: { category: true, platform: true, tags: true },
        }),
      ),
    );

    return boardsGroup;
  },
  /** 2023/10/05 - 특정 카테고리 보드 개수 - by 1-blue */
  async countByCategory({ category }: { category: string }) {
    return await prisma.board.count({ where: { category: { category } } });
  },
  /** 2023/10/05 - 보드 생성 - by 1-blue */
  async create({ name, date, category, platform, tags, pdf }: ApiCreateBoardRequest) {
    const count = await this.countByCategory({ category });

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

    return createdBoard;
  },
  /** 2023/10/05 - 단일 보드 찾기 - by 1-blue */
  async findOne({ idx }: { idx: number }) {
    const exBoard = await prisma.board.findUnique({
      where: { idx },
      include: { category: true, platform: true, tags: true },
    });

    return exBoard;
  },
  /** 2023/10/05 - 보드 수정 - by 1-blue */
  async update({
    exBoard,
    category,
    platform,
    idx,
    date,
    tags,
    ...rest
  }: ApiUpdateBoardRequest & { exBoard: BoardWithETC }) {
    // 다른 카테고리로 이동한 경우
    if (category !== exBoard.category.category) {
      await Promise.all([
        // 출발 보드 수정 ( 출발지 카테고리보다 뒤에 있는 보드 모두 순서 -1 )
        await prisma.board.updateMany({
          where: { order: { gt: exBoard.order }, categoryIdx: exBoard.categoryIdx },
          data: { order: { decrement: 1 } },
        }),
        // 도착 보드 수정 ( 도착지 카테고리 보드 모두 순서 +1 )
        await prisma.board.updateMany({
          where: { category: { category } },
          data: { order: { increment: 1 } },
        }),
      ]);

      // 수정될 보드 도착지의 첫 번째로 이동
      await prisma.board.update({
        where: { idx },
        data: { order: 0 },
      });
    }

    // FIXME: 태그 다 끊기
    await prisma.board.update({
      where: { idx },
      data: { tags: { set: [] } },
    });

    // FIXME: 수정될 데이터 업데이트 & 태그 다시 연결
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

    return updatedBoard;
  },
  /** 2023/10/05 - 보드 삭제 - by 1-blue */
  async delete({ exBoard, idx }: ApiDeleteBoardRequest & { exBoard: BoardWithETC }) {
    const [deletedBoard] = await Promise.all([
      // 보드 제거
      prisma.board.delete({ where: { idx } }),
      // 같은 카테고리 순서 변경
      prisma.board.updateMany({
        where: { order: { gt: exBoard.order }, categoryIdx: exBoard.categoryIdx },
        data: { order: { decrement: 1 } },
      }),
    ]);

    return deletedBoard;
  },
  /** 2023/10/05 - 보드 이동 - by 1-blue */
  async move({ exBoard, idx, category, order }: ApiMoveBoardRequest & { exBoard: BoardWithETC }) {
    // 다른 보드 이동인 경우
    if (category !== exBoard.category.category) {
      await Promise.all([
        // 출발 보드 수정
        prisma.board.updateMany({
          where: { order: { gt: exBoard.order }, categoryIdx: exBoard.categoryIdx },
          data: { order: { decrement: 1 } },
        }),
        // 도착 보드 수정
        prisma.board.updateMany({
          where: { order: { gte: order }, category: { category } },
          data: { order: { increment: 1 } },
        }),
      ]);
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

    return updatedBoard;
  },
};
