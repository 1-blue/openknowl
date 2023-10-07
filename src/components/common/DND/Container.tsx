import styled from 'styled-components';
import { DragDropContext, type OnDragEndResponder } from 'react-beautiful-dnd';

const StyledContainer = styled.article`
  display: inline-flex;
  flex-flow: column nowrap;

  padding: 1em;

  border: 2px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 0.2em;

  & > * + * {
    margin-top: 1em;
  }

  & .dnd-board-wrapper {
    padding: 1em;

    background-color: ${({ theme }) => theme.colors.gray200};
    border-radius: 0.2em;

    &:has(.dnd-dropzone-hover) {
      background-color: ${({ theme }) => theme.colors.main200};
    }
  }
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
