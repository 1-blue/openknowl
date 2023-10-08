import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiMoveBoardRequest, ApiMoveBoardResponse } from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { query: { idx: string }; body: Omit<ApiMoveBoardRequest, 'idx'> }>,
  res: NextApiResponse<ApiMoveBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await boardService.findOne({ idx });

  if (!exBoard) return res.status(404).json({ message: '존재하지 않는 보드입니다!' });

  // 특정 카드 이동
  if (method === 'PATCH') {
    const { sourceOrder, destinationOrder } = req.body;

    const updatedBoard = await boardService.move({
      idx,
      sourceOrder: +sourceOrder,
      destinationOrder: +destinationOrder,
    });

    return res.status(200).json({
      message: `"${exBoard.category}" 보드가 이동되었습니다.`,
      data: updatedBoard,
    });
  }
};

export default handler;
