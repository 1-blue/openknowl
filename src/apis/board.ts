import axiosInstance from '.';

import type { ApiMoveBoardRequest, ApiMoveBoardResponse } from '@/types/apis';

type ApiMoveBoardHandler = (body: ApiMoveBoardRequest) => Promise<ApiMoveBoardResponse>;

/** 2023/09/19 - 보드 이동 - by 1-blue */
export const apiMoveBoard: ApiMoveBoardHandler = async ({ idx, ...body }) => {
  const { data } = await axiosInstance.patch<ApiMoveBoardResponse>(`/board/move/${idx}`, body);

  return data;
};
