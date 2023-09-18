import { ThemeProvider } from 'styled-components';

import theme from '@/styles/theme';
import { GlobalStyle } from '@/styles/global';

/** 2023/09/18 - `styled-components`의 `theme Provider` - by 1-blue */
const MyStyledProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default MyStyledProvider;
