import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiFindAllTagsOfBoardResponse } from '@/types/apis';
import prisma from '@/prisma';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiFindAllTagsOfBoardResponse>,
) => {
  const { method } = req;

  // 모든 태그 찾기
  if (method === 'GET') {
    const tags = await prisma.tag.findMany();

    return res.status(200).json({ data: tags });
  }
};

export default handler;
