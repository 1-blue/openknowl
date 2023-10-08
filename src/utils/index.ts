/** 2023/09/25 - PDF 경로에서 파일 이름만 가져오는 함수 - by 1-blue */
export const getPDFName = (pdfURL: string) => {
  return pdfURL.slice(pdfURL.lastIndexOf('/') + 1);
};
