/** 2023/09/26 - quert string으로 만드는 헬퍼함수 - by 1-blue */
export const buildQueryString = (url: string, params: { [key: string]: string | null }) => {
  const queryString = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key]!)}`)
    .join('&');

  return url + (queryString ? `?${queryString}` : '');
};

/** 2023/10/08 - 클래스 이름 합쳐주는 함수 */
export const combineClassName = (...conditions: (string | null | undefined | boolean)[]) => {
  let className = '';

  // 조건을 순회하면서 참인 경우에만 클래스명을 추가
  conditions.forEach(condition => {
    if (condition === true) return;
    if (condition) {
      className += ` ${condition}`;
    }
  });

  return className;
};
