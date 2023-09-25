import { mutate } from 'swr';
import styled from 'styled-components';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import { apiMoveBoard } from '@/apis';

const StyledContainer = styled.article`
  display: inline-flex;

  padding: 1em 0.4em;

  & > * + * {
    margin-left: 1em;
  }
`;

/** 2023/09/19 - 보드들의 래퍼 컴포넌트들을 감싸는 컨테이너 컴포넌트 - by 1-blue */
const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  /** 2023/09/19 - `<Draggable>`이 `<Droppable>`로 드래그 되었을 때 실행되는 이벤트 - by 1-blue */
  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {
    // 정해지지 않은 공간에 드랍한 경우
    if (!destination) return;
    // 같은 위치에 드랍한 경우
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // const sourceCategory = source.droppableId;
    // const sourceOrder = source.index;
    const targetIdx = +draggableId;
    const destinationCategory = destination.droppableId;
    const destinationOrder = destination.index;

    await apiMoveBoard({
      idx: targetIdx,
      category: destinationCategory,
      order: destinationOrder,
    });

    // TODO:
    mutate('/board', board => board, { revalidate: true });
  };

  return (
    <StyledContainer>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
    </StyledContainer>
  );
};

export default Container;
