import styled from 'styled-components';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import type { ApiMoveCardRequest } from '@/types/apis';

const StyledContainer = styled.article`
  display: inline-flex;
  flex-flow: column nowrap;

  padding: 1em;

  border: 2px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 0.2em;

  & > * + * {
    margin-top: 1em;
  }

  & .dnd-container {
    display: inline-flex;

    & > * + * {
      margin-left: 1em;
    }
  }

  & .dnd-wrapper {
    height: 100%;
    padding: 1em;

    background-color: ${({ theme }) => theme.colors.gray200};
    border-radius: 0.2em;

    &:has(.dnd-dropzone-hover) {
      background-color: ${({ theme }) => theme.colors.main200};
    }
  }
`;

interface ContainerProps {
  onDragEndExecute(props: ApiMoveCardRequest): void;
}

/** 2023/09/19 - 보드들의 래퍼 컴포넌트들을 감싸는 컨테이너 컴포넌트 - by 1-blue */
const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
  children,
  onDragEndExecute,
}) => {
  /** 2023/09/19 - `<Draggable>`이 `<Droppable>`로 드래그 되었을 때 실행되는 이벤트 - by 1-blue */
  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {
    // 정해지지 않은 공간에 드랍한 경우
    if (!destination) return;

    const targetIdx = +draggableId;
    const sourceBoardIdx = +source.droppableId;
    const sourceOrder = source.index;
    const destinationBoardIdx = +destination.droppableId;
    const destinationOrder = destination.index;

    // 같은 위치에 드랍한 경우
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    onDragEndExecute({
      idx: targetIdx,
      sourceBoardIdx,
      sourceOrder,
      destinationBoardIdx,
      destinationOrder,
    });
  };

  return (
    <StyledContainer>
      <section className="dnd-container">
        <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
      </section>
    </StyledContainer>
  );
};

export default Container;
