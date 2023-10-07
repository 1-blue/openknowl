import axiosInstance from '.';

import type {
  ApiCreateCardRequest,
  ApiCreateCardResponse,
  ApiDeleteCardRequest,
  ApiDeleteCardResponse,
  ApiMoveCardRequest,
  ApiMoveCardResponse,
  ApiUpdateCardRequest,
  ApiUpdateCardResponse,
} from '@/types/apis';

type ApiMoveBoardHandler = (body: ApiMoveCardRequest) => Promise<ApiMoveCardResponse>;
type ApiCreateBoardHandler = (body: ApiCreateCardRequest) => Promise<ApiCreateCardResponse>;
type ApiUpdateBoardHandler = (body: ApiUpdateCardRequest) => Promise<ApiUpdateCardResponse>;
type ApiDeleteBoardHandler = (body: ApiDeleteCardRequest) => Promise<ApiDeleteCardResponse>;

/** 2023/09/19 - 카드 이동 - by 1-blue */
export const apiMoveCard: ApiMoveBoardHandler = async ({ idx, ...body }) => {
  const { data } = await axiosInstance.patch<ApiMoveCardResponse>(`/card/move/${idx}`, body);

  return data;
};

/** 2023/09/21 - 카드 추가 - by 1-blue */
export const apiCreateCard: ApiCreateBoardHandler = async body => {
  const { data } = await axiosInstance.post<ApiCreateCardResponse>(`/card`, body);

  return data;
};

/** 2023/09/21 - 카드 수정 - by 1-blue */
export const apiUpdateCard: ApiUpdateBoardHandler = async ({ idx, ...body }) => {
  const { data } = await axiosInstance.patch<ApiUpdateCardResponse>(`/card/${idx}`, body);

  return data;
};

/** 2023/09/21 - 카드 삭제 - by 1-blue */
export const apiDeleteCard: ApiDeleteBoardHandler = async ({ idx }) => {
  const { data } = await axiosInstance.delete<ApiDeleteCardResponse>(`/card/${idx}`);

  return data;
};
