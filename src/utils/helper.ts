/** 2023/09/26 - quert string으로 만드는 헬퍼함수 - by 1-blue */
export const buildQueryString = (url: string, params: { [key: string]: string | null }) => {
  const queryString = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key]!)}`)
    .join('&');

  return url + (queryString ? `?${queryString}` : '');
};
