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
    idx,
    sourceBoardIdx,
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

        // 이동할 카드 잘라내기
        const targetBoardIndex = copyBoards.findIndex(board => board.idx === sourceBoardIdx);
        const targetCardIndex = copyBoards[targetBoardIndex].cards.findIndex(
          card => card.idx === idx,
        );
        const [target] = copyBoards[targetBoardIndex].cards.splice(targetCardIndex, 1);

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
