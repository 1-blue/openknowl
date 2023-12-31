import styled from 'styled-components';
import { DragDropContext, type OnDragEndResponder } from 'react-beautiful-dnd';

const StyledContainer = styled.article`
  display: inline-flex;
  padding: 1em;

  border: 2px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 0.2em;
`;

interface ContainerProps {
  onDragEnd: OnDragEndResponder;
}

/** 2023/09/19 - Drag & Drop의 컨테이너 컴포넌트 - by 1-blue */
const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({ children, onDragEnd }) => {
  return (
    <StyledContainer>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
    </StyledContainer>
  );
};

export default Container;
