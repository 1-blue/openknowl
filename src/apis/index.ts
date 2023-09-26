import axios from 'axios';

/** 2023/09/19 - 서버로 요청할 때 사용할 인스턴스 - by 1-blue */
const axiosInstance = axios.create({
  baseURL: process.env['NEXT_PUBLIC_END_POINT'],
  timeout: 1000 * 20,
  withCredentials: true,
});

export default axiosInstance;

export * from './board';
export * from './s3';
