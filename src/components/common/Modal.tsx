import styled from 'styled-components';

const StyledModal = styled.div<Pick<React.CSSProperties, 'width' | 'maxWidth' | 'minWidth'>>`
  width: ${({ width }) => width ?? '60vw'};
  min-width: ${({ minWidth }) => minWidth ?? '480px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '1020px'};

  overflow-y: auto;

  border-radius: 0.6em;
  background-color: #fff;

  animation: ${({ theme }) => theme.animation.fadeIn} 0.6s ease-in-out;
`;

interface ModalProps extends Pick<React.CSSProperties, 'width' | 'maxWidth' | 'minWidth'> {}

/** 2023/09/21 - Modal Component - by 1-blue */
const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ children, ...restProps }) => {
  return <StyledModal {...restProps}>{children}</StyledModal>;
};

export default Modal;
