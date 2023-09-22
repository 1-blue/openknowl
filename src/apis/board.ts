import axiosInstance from '.';

import type {
  ApiCreateBoardRequest,
  ApiCreateBoardResponse,
  ApiDeleteBoardRequest,
  ApiDeleteBoardResponse,
  ApiMoveBoardRequest,
  ApiMoveBoardResponse,
  ApiUpdateBoardRequest,
  ApiUpdateBoardResponse,
} from '@/types/apis';

type ApiMoveBoardHandler = (body: ApiMoveBoardRequest) => Promise<ApiMoveBoardResponse>;
type ApiCreateBoardHandler = (body: ApiCreateBoardRequest) => Promise<ApiCreateBoardResponse>;
type ApiUpdateBoardHandler = (body: ApiUpdateBoardRequest) => Promise<ApiUpdateBoardResponse>;
type ApiDeleteBoardHandler = (body: ApiDeleteBoardRequest) => Promise<ApiDeleteBoardResponse>;

/** 2023/09/19 - 보드 이동 - by 1-blue */
export const apiMoveBoard: ApiMoveBoardHandler = async ({ idx, ...body }) => {
  const { data } = await axiosInstance.patch<ApiMoveBoardResponse>(`/board/move/${idx}`, body);

  return data;
};

/** 2023/09/21 - 보드 추가 - by 1-blue */
export const apiCreateBoard: ApiCreateBoardHandler = async body => {
  const { data } = await axiosInstance.post<ApiCreateBoardResponse>(`/board`, body);

  return data;
};

/** 2023/09/21 - 보드 수정 - by 1-blue */
export const apiUpdateBoard: ApiUpdateBoardHandler = async ({ idx, ...body }) => {
  const { data } = await axiosInstance.patch<ApiUpdateBoardResponse>(`/board/${idx}`, body);

  return data;
};

/** 2023/09/21 - 보드 삭제 - by 1-blue */
export const apiDeleteBoard: ApiDeleteBoardHandler = async ({ idx }) => {
  const { data } = await axiosInstance.delete<ApiDeleteBoardResponse>(`/board/${idx}`);

  return data;
};
