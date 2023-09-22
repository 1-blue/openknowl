import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiFindAllPlatformsOfBoardResponse } from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiFindAllPlatformsOfBoardResponse>,
) => {
  const { method } = req;

  // 모든 플랫폼 찾기
  if (method === 'GET') {
    const categories = await prisma.platform.findMany();

    return res.status(200).json({ data: categories });
  }
};

export default handler;
