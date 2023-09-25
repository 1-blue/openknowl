import axios from 'axios';
import axiosInstance from '.';

import type { ApiCreatePresignedURLRequest, ApiCreatePresignedURLResponse } from '@/types/apis';

type ApiFindOnePresignedURLHandler = (
  body: ApiCreatePresignedURLRequest,
) => Promise<ApiCreatePresignedURLResponse>;

/** 2023/09/23 - presignedURL 요청 - by 1-blue */
export const apiCreatePresignedURL: ApiFindOnePresignedURLHandler = async body => {
  const { data } = await axiosInstance.post<ApiCreatePresignedURLResponse>(`/presignedurl`, body);

  return data;
};

/** 2023/09/25 - PDF 업로드 - by 1-blue */
export const apiUploadPDF = async (file: File) => {
  const { data } = await apiCreatePresignedURL({ name: file.name });

  if (!data) return;

  const { url, fields } = data;
  const formData = new FormData();

  Object.entries(fields).forEach(([field, value]) => {
    formData.append(field, value);
  });
  formData.append('Content-Type', file.type);
  formData.append('file', file);

  // S3에 업로드
  await axios.post(url, formData);

  // 완성된 경로
  const pdfURL = url + fields.key;

  return { pdfURL };
};
