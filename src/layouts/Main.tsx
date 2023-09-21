import styled from 'styled-components';

const StyledMain = styled.main`
  padding: 2em;
`;

/** 2023/09/18 - `<main>` layout component - by 1-blue */
const Main: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <StyledMain>{children}</StyledMain>;
};

export default Main;
