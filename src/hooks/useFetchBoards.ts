import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { buildQueryString } from '@/utils/helper';

import type { ApiFindAllBoardsResponse, ApiMoveBoardRequest } from '@/types/apis';
import useFetchCategories from './useFetchCategoriesOfBoard';

/** 2023/09/19 - 모든 보드들 가져오는 훅 - by 1-blue */
const useFetchBoards = () => {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const tag = searchParams.get('tag');

  const { data, isLoading, error, mutate } = useSWR<ApiFindAllBoardsResponse>(
    buildQueryString('/board', { platform, tag }),
  );
  const { categories } = useFetchCategories();

  const boardsMutate = ({ idx, category, order }: ApiMoveBoardRequest) =>
    mutate<ApiFindAllBoardsResponse>(
      currentData => {
        if (!categories) return currentData!;
        if (!currentData) return currentData!;
        if (!currentData?.data) return currentData;
        if (!Array.isArray(currentData.data?.[0])) return currentData;

        /** 수정할 복사본 */
        const copyData = [...currentData.data.map(v => [...v])];
        let targetIndex = -1;
        let targetIdx = -1;
        const categoryIndex = categories.findIndex(v => v.category === category);

        copyData.forEach((boards, index) =>
          boards.forEach((board, i) => {
            if (board.idx === idx) {
              targetIndex = index;
              targetIdx = i;
            }
          }),
        );

        const [target] = copyData[targetIndex].splice(targetIdx, 1);
        copyData[categoryIndex].splice(order, 0, target);

        return { ...currentData, data: copyData };
      },
      { revalidate: false },
    );

  return { boardsGroup: data?.data, isLoading, error, boardsMutate };
};

export default useFetchBoards;
