import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { IoChevronDown } from 'react-icons/io5';

const StyledCustom500 = styled.article`
  position: fixed;
  inset: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  & .error-page-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    transform: translate3d(0, -30%, 0);

    & > * + * {
      margin-top: 1em;
    }

    & .error-page-title-container {
      & .logo {
        font-size: 14rem;
        font-weight: 900;
        color: #0150be;
      }
    }

    & .error-page-description {
      text-align: center;
      line-height: 1.4;

      font-size: 1.4rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.blue800};
    }

    & .error-page-icon {
      color: #0150be;
      width: 60px;
      height: 60px;

      animation: ${({ theme }) => theme.animation.bounce} 1s infinite 2s;
    }
  }

  & .error-page-link {
    padding: 1em 1.4em;

    text-decoration: none;
    color: ${({ theme }) => theme.colors.blue800};
    border: 2px solid ${({ theme }) => theme.colors.blue800};
    border-radius: 0.4em;
    font-weight: 600;

    transition: all 0.4s;

    &:hover {
      font-weight: 900;
      color: #fff;
      background-color: ${({ theme }) => theme.colors.blue800};
    }
  }
`;

/** 2023/09/23 - 500 Custom Error Page Component - by 1-blue */
const Custom500: React.FC = () => {
  return (
    <StyledCustom500>
      <section className="error-page-container">
        <div className="error-page-title-container">
          <span className="logo">5</span>
          <Image src="/logo.png" width={160} height={160} alt="로고 이미지" />
          <Image src="/logo.png" width={160} height={160} alt="로고 이미지" />
        </div>
        <p className="error-page-description">
          웹페이지에 문제가 발생했습니다.
          <br />
          잠시후에 다시 시도해주세요!
        </p>
        <IoChevronDown className="error-page-icon" />
        <Link href="/" className="error-page-link">
          메인 페이지로 이동하기
        </Link>
      </section>
    </StyledCustom500>
  );
};

export default Custom500;
