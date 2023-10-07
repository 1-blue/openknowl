import useSWR from 'swr';

import type { ApiFindAllPlatformsOfCardResponse } from '@/types/apis';

/** 2023/09/22 - 카드의 모든 플랫폼을 가져오는 훅 - by 1-blue */
const useFetchPlatforms = () => {
  const { data, isLoading, error } = useSWR<ApiFindAllPlatformsOfCardResponse>('/platform');

  return { platforms: data?.data, isLoading, error };
};

export default useFetchPlatforms;
