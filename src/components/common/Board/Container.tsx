import { mutate } from 'swr';
import styled from 'styled-components';
import { apiMoveBoard } from '@/apis';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import { useAppSelector } from '@/store';

import Overlay from '@/components/common/Overlay';
import Modal from '@/components/common/Modal';
import BoardForm from '@/components/Board/BoardForm';

import type { Board, Category } from '@prisma/client';

const StyledContainer = styled.article`
  display: inline-flex;

  padding: 1em 0.4em;

  & > * + * {
    margin-left: 1em;
  }
`;

interface ContainerProps {
  boards: Board[];
}

/** 2023/09/19 - 보드들의 래퍼 컴포넌트들을 감싸는 컨테이너 컴포넌트 - by 1-blue */
const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({ boards, children }) => {
  const { isShow } = useAppSelector(state => state.boardModal);

  /** 2023/09/19 - `<Draggable>`이 `<Droppable>`로 드래그 되었을 때 실행되는 이벤트 - by 1-blue */
  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {
    // 잘못된 공간에 드랍한 경우
    if (!destination) return;
    // 같은 위치에 드랍한 경우
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    //! FIXME: 다른 방법이 있는지 모르겠음 ? ( as )
    // const sourceCategory = source.droppableId as Category;
    // const sourceOrder = source.index;
    const destinationCategory = destination.droppableId as Category;
    const destinationOrder = destination.index;

    await apiMoveBoard({
      idx: +draggableId,
      category: destinationCategory,
      order: destinationOrder,
    });

    mutate('/board', boards, { revalidate: true });
  };

  return (
    <StyledContainer>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>

      {isShow && (
        <Overlay>
          <Modal>
            <BoardForm />
          </Modal>
        </Overlay>
      )}
    </StyledContainer>
  );
};

export default Container;

//! TODO: 적용하기
// mutate<ApiFindAllBoardsResponse, ApiFindAllBoardsResponse>(
//   '/board',
//   boards =>
//     boards && {
//       ...boards,
//       data: boards.data?.map(board => {
//         // 출발 보드 수정
//         if (board.category === sourceCategory) {
//           // 출발 보드 order 감소
//           if (board.order > sourceOrder) {
//             return { ...board, order: board.order - 1 };
//           }
//         }
//         // 도착 보드 수정
//         if (board.category === destinationCategory) {
//           // 도착 보드 order 증가
//           if (board.order >= destinationOrder) {
//             return { ...board, order: board.order + 1 };
//           }
//         }

//         // 해당 보드 이동
//         if (board.idx === +draggableId) {
//           return { ...board, category: destinationCategory, order: destinationOrder };
//         }

//         return board;
//       }),
//     },
//   { revalidate: false },
// );
