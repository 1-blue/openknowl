import { boardService } from '@/apis/services/board';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiDeleteBoardRequest,
  ApiDeleteBoardResponse,
  ApiUpdateBoardRequest,
} from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { query: ApiDeleteBoardRequest; body: ApiUpdateBoardRequest }>,
  res: NextApiResponse<ApiDeleteBoardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exBoard = await boardService.findOne({ idx });

  if (!exBoard) return res.status(404).json({ message: '존재하지 않는 보드입니다!' });

  // 특정 보드 수정
  if (method === 'PATCH') {
    const { currentCategory, category } = req.body;

    const updatedBoard = await boardService.update({ idx, category, currentCategory });

    return res.status(200).json({
      message: `"${exBoard.category}"에서 "${category}"로 변경했습니다.`,
      data: updatedBoard,
    });
  }
  // 특정 보드 삭제
  if (method === 'DELETE') {
    const deletedBoard = await boardService.delete({ idx });

    return res.status(200).json({
      message: `"${deletedBoard.category}" 보드를 제거했습니다.`,
      data: deletedBoard,
    });
  }
};

export default handler;
