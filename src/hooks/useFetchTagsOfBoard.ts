import useSWR from 'swr';

import type { ApiFindAllTagsOfBoardResponse } from '@/types/apis';

/** 2023/09/26 - 보드의 모든 태그들을 가져오는 훅 - by 1-blue */
const useFetchTagsOfBoard = () => {
  const { data, isLoading, error } = useSWR<ApiFindAllTagsOfBoardResponse>('/board/tag');

  return { tags: data?.data, isLoading, error };
};

export default useFetchTagsOfBoard;
