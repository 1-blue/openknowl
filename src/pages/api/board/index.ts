import type { NextApiRequest, NextApiResponse } from 'next';
import type { Override } from '@/types';
import type {
  ApiCreateBoardRequest,
  ApiCreateBoardResponse,
  ApiFindAllBoardsResponse,
  ApiUpdateBoardRequest,
} from '@/types/apis';
import type { Prisma } from '@prisma/client';
import prisma from '@/prisma';

/**
 * @swagger
 * /api/board:
 *  get:
 *    summary: 모든 보드들 요청
 *    description: 모든 보드들 요청
 *    parameters:
 *      - in: query
 *        name: 플랫폼
 *        schema:
 *          type: string
 *        description: ex) 미니인턴 & 원티드 & 잡코리아 & 로켓펀치 & 사람인
 *      - in: query
 *        name: 태그
 *        schema:
 *          type: string
 *        description: ex) \#연봉협상,\#면접,\#시니어,\#오픈놀,\#기업과제,\#태그
 *    responses:
 *      200:
 *        description: 모든 보드들 응답
 *  post:
 *    summary: 보드 생성
 *    description: 보드 생성
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            name: string
 *            date: date
 *            category: string
 *            platform: string
 *            tags: array
 *            pdf: string
 *          example:
 *            name: Swagger 테스트
 *            date: 2023-12-31T23:59
 *            category: 검토
 *            platform: 미니인턴
 *            tags: ['#미니인턴', '#면접', '#기업과제']
 *            pdf: https://bleplayground.s3.ap-northeast-2.amazonaws.com/test.pdf
 *    responses:
 *      201:
 *        description: 보드 생성 완료
 */
const handler = async (
  req: Override<
    NextApiRequest,
    {
      body: ApiCreateBoardRequest | ApiUpdateBoardRequest;
      query: { platform?: string; tag?: string };
    }
  >,
  res: NextApiResponse<ApiCreateBoardResponse | ApiFindAllBoardsResponse>,
) => {
  const { method } = req;

  // 모든 보드 찾기
  if (method === 'GET') {
    const { platform, tag } = req.query;

    const where: Prisma.BoardFindManyArgs = {
      where: {
        ...(platform && {
          platform: { platform: { equals: platform } },
        }),
        ...(tag && {
          tags: { some: { tag: { in: tag.split(',') } } },
        }),
      },
    };

    const categories = await prisma.category.findMany();

    const boardsGroup = await Promise.all(
      categories.map(({ idx }) =>
        prisma.board.findMany({
          where: { category: { idx }, ...where.where },
          orderBy: [{ order: 'asc' }],
          include: { category: true, platform: true, tags: true },
        }),
      ),
    );

    return res.status(200).json({
      data: boardsGroup,
    });
  }
  // 보드 생성
  else if (method === 'POST') {
    const { name, date, category, platform, tags, pdf } = req.body;

    const count = await prisma.board.count({ where: { category: { category } } });

    const createdBoard = await prisma.board.create({
      data: {
        name,
        date: new Date(date),
        order: count,
        category: { connect: { category } },
        platform: { connect: { platform } },
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { tag },
            create: { tag },
          })),
        },
        pdf,
      },
      include: {
        tags: true,
      },
    });

    return res.status(201).json({
      message: `"${name}" 보드가 생성되었습니다.`,
      data: createdBoard,
    });
  }
};

export default handler;
