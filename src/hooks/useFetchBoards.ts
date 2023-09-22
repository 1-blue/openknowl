import useSWR from 'swr';

import type { ApiFindAllBoardsResponse } from '@/types/apis';

/** 2023/09/19 - 모든 보드들 가져오는 훅 - by 1-blue */
const useFetchBoards = () => {
  const { data, isLoading, error, mutate } = useSWR<ApiFindAllBoardsResponse>('/board');

  return { boardsGroup: data?.data, isLoading, error, boardsMutate: mutate };
};

export default useFetchBoards;
