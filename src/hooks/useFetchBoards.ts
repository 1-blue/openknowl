import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { buildQueryString } from '@/utils/helper';

import type { ApiFindAllBoardsResponse, ApiMoveCardRequest } from '@/types/apis';

/** 2023/09/19 - 모든 보드들 가져오는 훅 - by 1-blue */
const useFetchBoards = () => {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const tag = searchParams.get('tag');

  const { data, isLoading, error, mutate } = useSWR<ApiFindAllBoardsResponse>(
    buildQueryString('/board', { platform, tag }),
  );

  const boardsMutate = ({
    sourceBoardIdx,
    sourceOrder,
    destinationBoardIdx,
    destinationOrder,
  }: ApiMoveCardRequest) =>
    mutate<ApiFindAllBoardsResponse>(
      currentBoards => {
        if (!currentBoards) return currentBoards!;
        if (!currentBoards?.data) return currentBoards;

        // 얕은 복사본 생성
        const copyBoards = JSON.parse(
          JSON.stringify(currentBoards.data),
        ) as typeof currentBoards.data;

        /** 출발 보드 인덱스 */
        const sourceBoardIndex = copyBoards.findIndex(board => board.idx === sourceBoardIdx);
        /** 출발 카드 인덱스 */
        const sourceCardIndex = copyBoards[sourceBoardIndex].cards.findIndex(
          card => card.order === sourceOrder,
        );
        /** 도착 보드 인덱스 */
        const destinationBoardIndex = copyBoards.findIndex(
          board => board.idx === destinationBoardIdx,
        );

        // 출발 위치의 카드들 order 수정
        copyBoards[sourceBoardIndex].cards = copyBoards[sourceBoardIndex].cards.map(card => {
          if (card.order < sourceOrder) return card;

          // 출발 카드 위치보다 뒤에 있다면 -1
          return { ...card, order: card.order - 1 };
        });
        // 도착 위치의 카드들 order 수정
        copyBoards[destinationBoardIndex].cards = copyBoards[destinationBoardIndex].cards.map(
          card => {
            if (card.order < destinationOrder) return card;

            // 도착 카드 위치보다 뒤에 있다면 +1
            return { ...card, order: card.order + 1 };
          },
        );

        // 이동할 카드 잘라내기
        const [target] = copyBoards[sourceBoardIndex].cards.splice(sourceCardIndex, 1);

        // 이동할 카드 순서 변경
        target.order = destinationOrder;

        // 이동할 카드 붙여넣기
        copyBoards
          .find(board => board.idx === destinationBoardIdx)
          ?.cards.splice(destinationOrder, 0, target);

        return { ...currentBoards, data: copyBoards };
      },
      { revalidate: false },
    );

  return { boards: data?.data, isLoading, error, boardsMutate };
};

export default useFetchBoards;
