import prisma from '@/prisma';

export const tagService = {
  /** 2023/10/05 - 모든 태그 찾기 - by 1-blue */
  async findAll() {
    const tags = await prisma.tag.findMany({ orderBy: { tag: 'asc' } });

    return tags;
  },
};
