import { cardService } from '@/apis/services/card';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiCreateCardRequest, ApiCreateCardResponse } from '@/types/apis';
import { boardService } from '@/apis/services/board';

const handler = async (
  req: Override<NextApiRequest, { body: ApiCreateCardRequest }>,
  res: NextApiResponse<ApiCreateCardResponse>,
) => {
  const { method } = req;

  // 카드 생성
  if (method === 'POST') {
    const { name, category } = req.body;

    const targetBoard = await boardService.findOneByCategory({ category });
    if (!targetBoard) return res.status(409).json({ message: '잘못된 데이터입니다.' });

    const createdCard = await cardService.create({ ...req.body, boardIdx: targetBoard.idx });

    return res.status(201).json({ message: `"${name}" 카드가 생성되었습니다.`, data: createdCard });
  }
};

export default handler;
