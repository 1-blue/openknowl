import useSWR from 'swr';

import type { ApiFindOneCardResponse } from '@/types/apis';

/** 2023/09/22 - 특정 카드를 가져오는 훅 - by 1-blue */
const useFetchCard = ({ idx }: { idx: number }) => {
  const { data, isLoading, error } = useSWR<ApiFindOneCardResponse>(
    idx !== -1 ? `/card/${idx}` : null,
  );

  return { card: data?.data, isLoading, error };
};

export default useFetchCard;
