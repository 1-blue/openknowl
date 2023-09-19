import { boards } from '@/utils/dummy';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiDeleteBoardResponse,
  ApiFindOneBoardResponse,
  ApiUpdateBoardResponse,
} from '@/types/apis';

const handler = (
  req: Override<NextApiRequest, { query: { idx: string } }>,
  res: NextApiResponse<ApiFindOneBoardResponse | ApiUpdateBoardResponse | ApiDeleteBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  // 특정 보드 찾기
  if (method === 'GET') {
    const exBoard = boards.find(board => board.idx === idx);

    if (!exBoard) {
      return res.status(404).json({
        message: '존재하지 않는 보드입니다!',
      });
    }

    res.status(200).json({
      message: `"${exBoard.title}" 보드를 찾았습니다.`,
      data: exBoard,
    });
  }
  // 특정 보드 수정
  else if (method === 'PATCH') {
    const { category, title, description } = req.body;

    const targetIndex = boards.findIndex(board => board.idx === idx);

    if (targetIndex === -1) {
      return res.status(404).json({
        message: '존재하지 않는 보드입니다.',
      });
    }

    boards[targetIndex] = { ...boards[targetIndex], category, title, description };

    return res.status(200).json({
      message: `"${boards[targetIndex].title}" 보드가 수정되었습니다.`,
      data: boards[targetIndex],
    });
  }
  // 특정 보드 삭제
  else if (method === 'DELETE') {
    const exBoard = boards.find(board => board.idx === idx);
    const targetIndex = boards.findIndex(board => board.idx === idx);

    if (!exBoard) {
      return res.status(404).json({
        message: '존재하지 않는 보드입니다.',
      });
    }

    const copyBoard = { ...exBoard };

    boards.splice(targetIndex, 1);

    return res.status(200).json({
      message: `"${copyBoard.title}" 보드를 제거했습니다.`,
      data: copyBoard,
    });
  }
};

export default handler;
