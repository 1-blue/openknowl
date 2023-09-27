import useSWR from 'swr';

import { buildQueryString } from '@/utils/helper';

import type { ApiFindAllBoardsResponse } from '@/types/apis';

interface UseFetchBoardsProps {
  platform: string | null;
  tag: string | null;
}

/** 2023/09/19 - 모든 보드들 가져오는 훅 - by 1-blue */
const useFetchBoards = ({ platform, tag }: UseFetchBoardsProps) => {
  const { data, isLoading, error, mutate } = useSWR<ApiFindAllBoardsResponse>(
    buildQueryString('/board', { platform, tag }),
  );

  return { boardsGroup: data?.data, isLoading, error, boardsMutate: mutate };
};

export default useFetchBoards;
