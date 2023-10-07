import { cardService } from '@/apis/services/card';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiDeleteCardRequest,
  ApiDeleteCardResponse,
  ApiFindOneCardResponse,
  ApiUpdateCardRequest,
  ApiUpdateCardResponse,
} from '@/types/apis';

const handler = async (
  req: Override<NextApiRequest, { query: ApiDeleteCardRequest; body: ApiUpdateCardRequest }>,
  res: NextApiResponse<ApiFindOneCardResponse | ApiUpdateCardResponse | ApiDeleteCardResponse>,
) => {
  const { method } = req;
  const idx = +req.query.idx;

  const exCard = await cardService.findOne({ idx });

  if (!exCard) return res.status(404).json({ message: '존재하지 않는 카드입니다!' });

  // 특정 카드 찾기
  if (method === 'GET') {
    return res.status(200).json({ data: exCard });
  }
  // 특정 카드 수정
  else if (method === 'PATCH') {
    // TODO: 카테고리 고치고 수정
    // const updatedBoard = await cardService.update({ exCard, ...req.body });
    // return res.status(200).json({
    //   message: `"${exCard.name}" 카드가 수정되었습니다.`,
    //   data: updatedBoard,
    // });
  }
  // 특정 카드 삭제
  else if (method === 'DELETE') {
    const deletedBoard = await cardService.delete({
      idx,
      boardIdx: exCard.boardIdx,
      cardOrder: exCard.order,
    });

    return res.status(200).json({
      message: `"${deletedBoard.name}" 카드를 제거했습니다.`,
      data: deletedBoard,
    });
  }
};

export default handler;
