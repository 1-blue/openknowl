import useSWR from 'swr';

import type { ApiFindAllTagsOfCardResponse } from '@/types/apis';

/** 2023/09/26 - 카드의 모든 태그들을 가져오는 훅 - by 1-blue */
const useFetchTagsOfCard = () => {
  const { data, isLoading, error } = useSWR<ApiFindAllTagsOfCardResponse>('/card/tag');

  return { tags: data?.data, isLoading, error };
};

export default useFetchTagsOfCard;
