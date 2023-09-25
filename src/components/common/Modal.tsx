import styled from 'styled-components';

const StyledModal = styled.div`
  width: 50vw;
  max-width: 1020px;
  min-width: 480px;

  overflow-y: auto;

  border-radius: 0.6em;
  background-color: #fff;

  animation: ${({ theme }) => theme.animation.fadeIn} 0.6s ease-in-out;
`;

/** 2023/09/21 - Modal Component - by 1-blue */
const Modal: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <StyledModal>{children}</StyledModal>;
};

export default Modal;
