import { PrismaClient } from '@prisma/client';

import { getBoards } from './board';

const prisma = new PrismaClient();

async function main() {
  await prisma.board.createMany({
    skipDuplicates: true,
    data: getBoards(),
  });
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
