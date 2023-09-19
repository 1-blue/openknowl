import { boards } from '@/utils/dummy';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type { ApiMoveBoardRequest, ApiMoveBoardResponse } from '@/types/apis';

const handler = (
  req: Override<NextApiRequest, { query: { idx: string }; body: Omit<ApiMoveBoardRequest, 'idx'> }>,
  res: NextApiResponse<ApiMoveBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  // 특정 보드 이동
  if (method === 'PATCH') {
    const { category, order } = req.body;

    const targetIndex = boards.findIndex(board => board.idx === idx);

    if (targetIndex === -1) {
      return res.status(404).json({
        message: '존재하지 않는 보드입니다.',
      });
    }

    boards[targetIndex] = { ...boards[targetIndex], category, order };

    return res.status(200).json({
      message: `"${boards[targetIndex].title}" 보드가 "${category}"로 이동되었습니다.`,
      data: boards[targetIndex],
    });
  }
};

export default handler;
