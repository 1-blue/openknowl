import { cardService } from '@/apis/services/card';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiMoveCardRequest, ApiMoveCardResponse } from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { query: { idx: string }; body: Omit<ApiMoveCardRequest, 'idx'> }>,
  res: NextApiResponse<ApiMoveCardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exCard = await cardService.findOne({ idx });

  if (!exCard) return res.status(404).json({ message: '존재하지 않는 카드입니다!' });

  // 특정 카드 이동
  if (method === 'PATCH') {
    const { sourceBoardIdx, sourceOrder, destinationBoardIdx, destinationOrder } = req.body;

    const updatedBoard = await cardService.move({
      ...req.body,
      cardIdx: idx,
      sourceBoardIdx: +sourceBoardIdx,
      sourceOrder: +sourceOrder,
      destinationBoardIdx: +destinationBoardIdx,
      destinationOrder: +destinationOrder,
    });

    return res.status(200).json({
      message: `"${exCard.name}" 카드가 이동되었습니다.`,
      data: updatedBoard,
    });
  }
};

export default handler;
