import prisma from '@/prisma';

export const platformService = {
  /** 2023/10/05 - 모든 플랫폼 찾기 - by 1-blue */
  async findAll() {
    const platforms = await prisma.platform.findMany();

    return platforms;
  },
};
