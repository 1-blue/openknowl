import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiFindAllCategoriesOfBoardResponse } from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiFindAllCategoriesOfBoardResponse>,
) => {
  const { method } = req;

  // 모든 카테고리 찾기
  if (method === 'GET') {
    const categories = await prisma.category.findMany();

    return res.status(200).json({ data: categories });
  }
};

export default handler;
