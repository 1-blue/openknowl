import Image from 'next/image';
import styled from 'styled-components';

const StyledSpinner = styled.aside`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  perspective: 600px;

  & > .logo-image {
    animation: ${({ theme }) => theme.animation.spinY} 1.4s linear infinite;
  }
`;

/** 2023/09/25 - Spinner Component - by 1-blue */
const Spinner: React.FC = () => {
  return (
    <StyledSpinner>
      <Image src="/logo.png" width={240} height={240} alt="로고 이미지" className="logo-image" />
    </StyledSpinner>
  );
};

export default Spinner;
