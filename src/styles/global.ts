import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

/** 2023/09/18 - 전역 스타일 설정 컴포넌트 - by 1-blue */
export const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    box-sizing: border-box;

    line-height: 1;

    font-family: "Pretendard", "Noto Sans KR", sans-serif;

    color: ${({ theme }) => theme.colors.fg};
    background-color: ${({ theme }) => theme.colors.bg};
  }

  button[type="button"] {
    background-color: transparent;
    border: 0px solid transparent;
    cursor: pointer;
  }

  @media ${({ theme }) => theme.mediaSize.md} {
    html {
      font-size: 14px;
    }
  }
`;
