import { PrismaClient } from '@prisma/client';

import { getBoards, getTags, tags } from './dummy';

const prisma = new PrismaClient();

async function main() {
  try {
    // 더미보드와 더미태그 생성
    await Promise.allSettled([
      prisma.board.createMany({
        skipDuplicates: true,
        data: getBoards(),
      }),
      prisma.tag.createMany({
        skipDuplicates: true,
        data: getTags(),
      }),
    ]);

    // 총 보드 개수
    const boardCount = await prisma.board.count();

    // 랜덤으로 보드와 태그 연결 ( 20 * 4, 중복가능 )
    await Promise.all([
      ...Array(20)
        .fill(null)
        .map(() =>
          prisma.board.update({
            where: { idx: Math.floor(Math.random() * boardCount) + 1 },
            data: {
              tags: {
                connect: {
                  tag: tags[Math.floor(Math.random() * tags.length)],
                },
              },
            },
          }),
        ),
      ...Array(20)
        .fill(null)
        .map(() =>
          prisma.board.update({
            where: { idx: Math.floor(Math.random() * boardCount) + 1 },
            data: {
              tags: {
                connect: {
                  tag: tags[Math.floor(Math.random() * tags.length)],
                },
              },
            },
          }),
        ),
      ...Array(20)
        .fill(null)
        .map(() =>
          prisma.board.update({
            where: { idx: Math.floor(Math.random() * boardCount) + 1 },
            data: {
              tags: {
                connect: {
                  tag: tags[Math.floor(Math.random() * tags.length)],
                },
              },
            },
          }),
        ),
      ...Array(20)
        .fill(null)
        .map(() =>
          prisma.board.update({
            where: { idx: Math.floor(Math.random() * boardCount) + 1 },
            data: {
              tags: {
                connect: {
                  tag: tags[Math.floor(Math.random() * tags.length)],
                },
              },
            },
          }),
        ),
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
