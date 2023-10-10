import { PrismaClient } from '@prisma/client';

import { getBoards, getCards, getPlatforms, getTags, tags } from './dummy';

const prisma = new PrismaClient();

async function main() {
  try {
    // 더미 카테고리 & 더미 플랫폼 & 더미 태그 생성
    await Promise.all([
      prisma.platform.createMany({
        skipDuplicates: true,
        data: getPlatforms(),
      }),
      prisma.tag.createMany({
        skipDuplicates: true,
        data: getTags(),
      }),
    ]);

    // 더미 보드들 생성
    await prisma.board.createMany({
      skipDuplicates: true,
      data: getBoards(),
    });

    // 더미 카드들 생성
    await prisma.card.createMany({
      skipDuplicates: true,
      data: getCards(),
    });

    // 총 카드 개수
    const cardCount = await prisma.card.count();

    // 랜덤으로 보드와 태그 연결 ( 20 * 4, 중복가능 )
    await Promise.all([
      ...Array(20)
        .fill(null)
        .map(() =>
          prisma.card.update({
            where: { idx: Math.floor(Math.random() * cardCount) + 1 },
            data: {
              tags: {
                connect: {
                  tag: tags[Math.floor(Math.random() * tags.length)],
                },
              },
            },
          }),
        ),
      // ...Array(20)
      //   .fill(null)
      //   .map(() =>
      //     prisma.card.update({
      //       where: { idx: Math.floor(Math.random() * cardCount) + 1 },
      //       data: {
      //         tags: {
      //           connect: {
      //             tag: tags[Math.floor(Math.random() * tags.length)],
      //           },
      //         },
      //       },
      //     }),
      //   ),
    ]);
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
