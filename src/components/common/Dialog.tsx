import useOuterClick from '@/hooks/useOuterClick';
import styled from 'styled-components';

const StyledDialog = styled.aside`
  padding: 0.5em 0.3em;
  width: 120px;
  position: absolute;
  top: 100%;
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
    background-color: #fff;

    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray200};
    }
  }
`;

interface DialogProps {
  buttons: {
    type: string;
    label: string;
  }[];
  onClose: () => void;
  onClickButtonByBubbling: React.MouseEventHandler<HTMLElement>;
}

/** 2023/10/07 - Dialog Component - by 1-blue */
const Dialog: React.FC<React.PropsWithChildren<DialogProps>> = ({
  buttons,
  onClose,
  onClickButtonByBubbling,
  children,
}) => {
  const dialogRef = useOuterClick(onClose);

  return (
    <StyledDialog ref={dialogRef} onClick={onClickButtonByBubbling}>
      {buttons.map(({ type, label }) => (
        <button key={type} type="button" className="dialog-button" data-type={type}>
          {label}
        </button>
      ))}
      {children}
    </StyledDialog>
  );
};

export default Dialog;
