import prisma from '@/prisma';

import type {
  ApiCreateCardRequest,
  // ApiUpdateCardRequest,
  ApiDeleteCardRequest,
  ApiMoveCardRequest,
} from '@/types/apis';

export const cardService = {
  /** 2023/10/05 - 특정 카테고리를 가진 카드 개수 - by 1-blue */
  async countByBoard({ boardIdx }: { boardIdx: number }) {
    return await prisma.card.count({ where: { boardIdx } });
  },
  /** 2023/10/05 - 카드 생성 - by 1-blue */
  async create({
    name,
    date,
    pdf,
    platform,
    tags,
    boardIdx,
  }: ApiCreateCardRequest & { boardIdx: number }) {
    const count = await this.countByBoard({ boardIdx });

    const createdCard = await prisma.card.create({
      data: {
        name,
        date: new Date(date),
        order: count,
        pdf,
        // 보드 연결
        board: { connect: { idx: boardIdx } },
        // 플랫폼 연결
        platform: { connect: { platform } },
        // 태그 연결
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { tag },
            create: { tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return createdCard;
  },
  /** 2023/10/05 - 단일 카드 찾기 - by 1-blue */
  async findOne({ idx }: { idx: number }) {
    const exCard = await prisma.card.findUnique({
      where: { idx },
      include: {
        platform: true,
        tags: true,
        board: { include: { category: true } },
      },
    });

    return exCard;
  },
  // TODO: 카테고리 고치고 수정
  // /** 2023/10/05 - 카드 수정 - by 1-blue */
  // async update({
  //   exCard,
  //   category,
  //   platform,
  //   idx,
  //   date,
  //   tags,
  //   ...rest
  // }: ApiUpdateCardRequest & { exCard: CardWithETC }) {
  //   // 다른 카테고리로 이동한 경우
  //   if (category !== exCard.categoryIdx) {
  //     await Promise.all([
  //       // 출발 카드 수정 ( 출발지 카테고리보다 뒤에 있는 카드 모두 순서 -1 )
  //       await prisma.board.updateMany({
  //         where: { order: { gt: exCard.order }, categoryIdx: exCard.categoryIdx },
  //         data: { order: { decrement: 1 } },
  //       }),
  //       // 도착 카드 수정 ( 도착지 카테고리 카드 모두 순서 +1 )
  //       await prisma.board.updateMany({
  //         where: { category: { category } },
  //         data: { order: { increment: 1 } },
  //       }),
  //     ]);

  //     // 수정될 카드 도착지의 첫 번째로 이동
  //     await prisma.board.update({
  //       where: { idx },
  //       data: { order: 0 },
  //     });
  //   }

  //   // FIXME: 태그 다 끊기
  //   await prisma.board.update({
  //     where: { idx },
  //     data: { tags: { set: [] } },
  //   });

  //   // FIXME: 수정될 데이터 업데이트 & 태그 다시 연결
  //   const updatedBoard = await prisma.board.update({
  //     where: { idx },
  //     data: {
  //       ...rest,
  //       date: new Date(date),
  //       category: { connect: { category } },
  //       platform: { connect: { platform } },
  //       tags: { connectOrCreate: tags.map(tag => ({ where: { tag }, create: { tag } })) },
  //     },
  //   });

  //   return updatedBoard;
  // },
  /** 2023/10/05 - 카드 삭제 - by 1-blue */
  async delete({
    idx,
    boardIdx,
    cardOrder,
  }: ApiDeleteCardRequest & { boardIdx: number; cardOrder: number }) {
    const [deletedCard] = await Promise.all([
      // 카드 제거
      prisma.card.delete({ where: { idx } }),
      // 같은 카테고리 순서 변경
      prisma.card.updateMany({
        where: { order: { gt: cardOrder }, boardIdx },
        data: { order: { decrement: 1 } },
      }),
    ]);

    return deletedCard;
  },
  /** 2023/10/05 - 카드 이동 - by 1-blue */
  async move({
    cardIdx,
    sourceOrder,
    destinationOrder,
    sourceBoardIdx,
    destinationBoardIdx,
  }: Pick<ApiMoveCardRequest, 'sourceOrder' | 'destinationOrder'> & {
    cardIdx: number;
    sourceBoardIdx: number;
    destinationBoardIdx: number;
  }) {
    // 다른 카드 이동인 경우
    if (sourceBoardIdx !== destinationBoardIdx) {
      await Promise.all([
        // 출발 카드 수정 ( 출발위치보다 뒤에 있는 보드들 순서 -1 )
        prisma.card.updateMany({
          where: { order: { gt: sourceOrder }, boardIdx: sourceBoardIdx },
          data: { order: { decrement: 1 } },
        }),
        // 도착 카드 수정 ( 도착위치보다 뒤에 있는 보드들 순서 +1 )
        prisma.card.updateMany({
          where: { order: { gte: destinationOrder }, boardIdx: destinationBoardIdx },
          data: { order: { increment: 1 } },
        }),
      ]);
    }
    // 같은 카드 이동
    else {
      // 원래 순서보다 더 앞으로 간 경우
      if (destinationOrder < sourceOrder) {
        // 원래 위치와 이동할 위치의 사이에 카드들만 변경 ( +1 )
        await prisma.card.updateMany({
          where: {
            boardIdx: sourceBoardIdx,
            AND: [{ order: { lt: sourceOrder } }, { order: { gte: destinationOrder } }],
          },
          data: { order: { increment: 1 } },
        });
      }
      // 원래 순서보다 더 뒤로 간 경우
      else {
        // 원래 위치와 이동할 위치의 사이에 카드들만 변경 ( -1 )
        await prisma.card.updateMany({
          where: {
            boardIdx: sourceBoardIdx,
            AND: [{ order: { lte: destinationOrder } }, { order: { gt: sourceOrder } }],
          },
          data: { order: { decrement: 1 } },
        });
      }
    }

    const updatedCard = await prisma.card.update({
      where: { idx: cardIdx },
      data: { boardIdx: destinationBoardIdx, order: destinationOrder },
    });

    return updatedCard;
  },
};
