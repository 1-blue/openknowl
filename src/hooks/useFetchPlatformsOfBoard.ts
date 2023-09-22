import useSWR from 'swr';

import type { ApiFindAllPlatformsOfBoardResponse } from '@/types/apis';

/** 2023/09/22 - 보드의 모든 플랫폼을 가져오는 훅 - by 1-blue */
const useFetchPlatforms = () => {
  const { data, isLoading, error } = useSWR<ApiFindAllPlatformsOfBoardResponse>('/board/platform');

  return { platforms: data?.data, isLoading, error };
};

export default useFetchPlatforms;
