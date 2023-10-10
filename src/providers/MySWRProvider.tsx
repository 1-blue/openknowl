import { toast } from 'react-toastify';
import { SWRConfig } from 'swr';

import type { ApiResponse } from '@/types';

/** 2023/09/18 - 네트워크 에러에 사용할 커스텀 에러 클래스 - by 1-blue */
class MyNetworkError extends Error {
  public info = '';
  public status = -1;

  constructor(message: string) {
    super(message);
  }
}

/** 2023/09/18 - `swr`에서 사용할 공통 `fetcher` - by 1-blue */
const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(process.env['NEXT_PUBLIC_END_POINT'] + input, init);

  if (!res.ok) {
    const error = new MyNetworkError('My Network Error');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

/** 2023/09/18 - `swr`에서 사용할 공통 `Error` 핸들러 - by 1-blue */
const onError = (error: Error, key: string) => {
  if (error instanceof MyNetworkError) {
    toast.error(error.info);
    console.error('My Network Error >> ', key, error.info);
  } else {
    toast.error(error.message);
    console.error('Unknown Error >> ', error);
  }
};

const onSuccess = (data: ApiResponse<object>) => {
  data.message && toast.success(data.message);
};

interface MySWRProviderProps {
  fallback: { [key: string]: any };
}

/** 2023/09/18 - `swr`의 전역 설정 - by 1-blue */
const MySWRProvider: React.FC<React.PropsWithChildren<MySWRProviderProps>> = ({
  children,
  fallback,
}) => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 1000 * 60,
        fetcher,
        onError,
        onSuccess,
        fallback,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default MySWRProvider;
