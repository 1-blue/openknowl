import { useEffect } from 'react';
import styled from 'styled-components';

const StyledOverlay = styled.aside`
  position: fixed;
  inset: 0;
  margin: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.8);

  animation: ${({ theme }) => theme.animation.fadeIn} 0.6s ease-in-out;
`;

/** 2023/09/20 - Overlay Component - by 1-blue */
const Overlay: React.FC<React.PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => void (document.body.style.overflow = 'auto');
  });

  return <StyledOverlay>{children}</StyledOverlay>;
};

export default Overlay;
