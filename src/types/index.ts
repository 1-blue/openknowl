/** 2023/09/18 - 서버 응답에 대한 타입 - by 1-blue */
export interface ApiResponse<Data extends object> {
  message?: string;
  data?: Data;
}

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

/** 2023/09/27 - `react-select`에서 사용하는 option - by 1-blue */
export interface SelectOption {
  value: string;
  label: string;
}
