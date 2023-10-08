import useSWR from 'swr';

import type { ApiFindAllCategoryOfBoardResponse } from '@/types/apis';

/** 2023/09/22 - 보드의 모든 카테고리를 가져오는 훅 - by 1-blue */
const useFetchCategories = () => {
  const { data, isLoading, error } = useSWR<ApiFindAllCategoryOfBoardResponse>('/board/category');

  return { categories: data?.data, isLoading, error };
};

export default useFetchCategories;
