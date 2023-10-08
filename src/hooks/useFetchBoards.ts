import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { buildQueryString } from '@/utils/helper';

import type { ApiFindAllBoardsResponse } from '@/types/apis';

/** 2023/09/19 - 모든 보드들 가져오는 훅 - by 1-blue */
const useFetchBoards = () => {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const tag = searchParams.get('tag');

  const { data, isLoading, error, mutate } = useSWR<ApiFindAllBoardsResponse>(
    buildQueryString('/board', { platform, tag }),
  );

  /** 모든 보드들 가져오는 mutate  */
  const boardsMutate = (func: Parameters<typeof mutate<ApiFindAllBoardsResponse>>[0]) =>
    mutate<ApiFindAllBoardsResponse>(func, { revalidate: false });

  return { boards: data?.data, isLoading, error, boardsMutate };
};

export default useFetchBoards;
