import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { getPDFName } from '@/utils/board';

const StyledBoardDialog = styled.aside`
  padding: 0.2em;
  width: 120px;
  position: absolute;
  top: 16%;
  right: -30%;
  display: flex;
  flex-flow: column nowrap;

  background-color: #fff;
  box-shadow: 0px 0px 8px ${({ theme }) => theme.colors.gray300};
  border-radius: 0.6em;

  overflow: hidden;
  z-index: 1;

  & > .dialog-button {
    padding: 0.6em;
    text-align: center;

    font-size: ${({ theme }) => theme.fontSize.xs};
    border-radius: 0.4em;

    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray200};
    }
  }
`;

interface BoardDialogProps {
  onClose: () => void;
  pdfURL?: string | null;
}

/** 2023/09/20 - Board Dialog - by 1-blue */
const BoardDialog: React.FC<BoardDialogProps> = ({ onClose, pdfURL }) => {
  const dialogRef = useRef<HTMLElement>(null);

  /** 2023/09/20 - 외부 클릭 시 닫는 이벤트 핸들러 - by 1-blue */
  const handleClose = (e: MouseEvent) => {
    if (!dialogRef.current) return;
    if (!(e.target instanceof HTMLElement)) return;
    if (dialogRef.current.contains(e.target)) return;

    onClose();
  };

  useEffect(() => {
    window.addEventListener('click', handleClose);

    return () => {
      window.removeEventListener('click', handleClose);
    };
  }, []);

  /** 2023/09/25 - PDF 다운로드 - by 1-blue */
  const handlePDFDownload = async () => {
    if (!pdfURL) return;

    const response = await fetch(pdfURL);
    const file = await response.blob();

    const downloadUrl = window.URL.createObjectURL(file); // 해당 file을 가리키는 url 생성
    const anchorElement = document.createElement('a');

    document.body.appendChild(anchorElement);
    anchorElement.download = getPDFName(pdfURL);
    anchorElement.href = downloadUrl;
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <StyledBoardDialog ref={dialogRef}>
      <button type="button" className="dialog-button" data-type="update">
        수정
      </button>
      <button type="button" className="dialog-button" data-type="delete">
        삭제
      </button>
      {pdfURL && (
        <>
          <Link className="dialog-button" href={pdfURL} target="_blank">
            PDF 보기
          </Link>
          <button type="button" className="dialog-button" onClick={handlePDFDownload}>
            PDF 다운로드
          </button>
        </>
      )}
    </StyledBoardDialog>
  );
};

export default BoardDialog;
