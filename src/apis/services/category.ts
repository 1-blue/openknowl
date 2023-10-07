import prisma from '@/prisma';

export const categoryService = {
  /** 2023/10/05 - 모든 카테고리 찾기 - by 1-blue */
  async findAll() {
    const categories = await prisma.category.findMany({ orderBy: { board: { order: 'asc' } } });

    return categories;
  },
};
