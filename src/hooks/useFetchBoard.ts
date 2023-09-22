import useSWR from 'swr';

import type { ApiFindOneBoardResponse } from '@/types/apis';

/** 2023/09/22 - 특정 보드를 가져오는 훅 - by 1-blue */
const useFetchBoard = ({ idx }: { idx: number }) => {
  const { data, isLoading, error } = useSWR<ApiFindOneBoardResponse>(
    idx !== -1 ? `/board/${idx}` : null,
  );

  return { board: data?.data, isLoading, error };
};

export default useFetchBoard;
