import styled from 'styled-components';

import Header from '@/layouts/Header';
import Nav from '@/layouts/Nav';
import Main from '@/layouts/Main';
import Footer from '@/layouts/Footer';

const StyledGeneralLayout = styled.div``;

/** 2023/09/18 - 일반 레이아웃 component - by 1-blue */
const GeneralLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <StyledGeneralLayout>
      <Header />
      <Nav />
      <Main>{children}</Main>
      <Footer />
    </StyledGeneralLayout>
  );
};

export default GeneralLayout;
