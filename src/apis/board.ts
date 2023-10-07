import axiosInstance from '.';

import type { ApiDeleteBoardRequest, ApiDeleteBoardResponse } from '@/types/apis';

type ApiDeleteBoardHandler = (body: ApiDeleteBoardRequest) => Promise<ApiDeleteBoardResponse>;

/** 2023/10/07 - 보드 삭제 - by 1-blue */
export const apiDeleteBoard: ApiDeleteBoardHandler = async ({ idx }) => {
  const { data } = await axiosInstance.delete<ApiDeleteBoardResponse>(`/board/${idx}`);

  return data;
};
