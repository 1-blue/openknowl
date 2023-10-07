import axiosInstance from '.';

import type {
  ApiCreateBoardRequest,
  ApiCreateBoardResponse,
  ApiDeleteBoardRequest,
  ApiDeleteBoardResponse,
} from '@/types/apis';

type ApiDeleteBoardHandler = (body: ApiDeleteBoardRequest) => Promise<ApiDeleteBoardResponse>;
type ApiCreateBoardHandler = (body: ApiCreateBoardRequest) => Promise<ApiCreateBoardResponse>;

/** 2023/10/07 - 보드 삭제 - by 1-blue */
export const apiDeleteBoard: ApiDeleteBoardHandler = async ({ idx }) => {
  const { data } = await axiosInstance.delete<ApiDeleteBoardResponse>(`/board/${idx}`);

  return data;
};

/** 2023/10/07 - 보드 생성 - by 1-blue */
export const apiCreateBoard: ApiCreateBoardHandler = async ({ category }) => {
  const { data } = await axiosInstance.post<ApiCreateBoardResponse>(`/board`, { category });

  return data;
};
