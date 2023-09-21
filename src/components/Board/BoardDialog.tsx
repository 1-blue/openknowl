import { useEffect, useRef } from 'react';
import styled from 'styled-components';

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
}

/** 2023/09/20 - Board Dialog - by 1-blue */
const BoardDialog: React.FC<BoardDialogProps> = ({ onClose }) => {
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

  return (
    <StyledBoardDialog ref={dialogRef}>
      <button type="button" className="dialog-button" data-type="update">
        수정
      </button>
      <button type="button" className="dialog-button" data-type="delete">
        삭제
      </button>
    </StyledBoardDialog>
  );
};

export default BoardDialog;
