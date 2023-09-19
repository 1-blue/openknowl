import { mutate } from 'swr';
import styled from 'styled-components';
import { apiMoveBoard } from '@/apis';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import type { Category } from '@/types';
import type { ApiFindAllBoardsResponse } from '@/types/apis';

const StyledContainer = styled.article`
  display: flex;
  justify-content: space-between;

  padding: 1em 0.4em;

  & > * + * {
    margin-left: 1em;
  }
`;

/** 2023/09/19 - 보드들의 래퍼 컴포넌트들을 감싸는 컨테이너 컴포넌트 - by 1-blue */
const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  /** 2023/09/19 - `<Draggable>`이 `<Droppable>`로 드래그 되었을 때 실행되는 이벤트 - by 1-blue */
  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {
    // 잘못된 공간에 드랍한 경우
    if (!destination) return;
    // 같은 위치에 드랍한 경우
    if (destination.droppableId === source.droppableId) return;

    // 보드 이동 요청 및 SWR 캐싱 데이터 변경
    mutate<ApiFindAllBoardsResponse, ApiFindAllBoardsResponse>(
      '/board',
      async res => {
        if (!res) return;
        if (!res.data) return;

        try {
          const { data } = await apiMoveBoard({
            idx: +draggableId,
            //! FIXME: 다른 방법이 있는지 모르겠음 ? ( as )
            category: destination.droppableId as Category,
            order: destination.index - 1,
          });

          if (!data) {
            return res;
          }

          return {
            ...res,
            data: res.data.map(board => {
              if (board.idx === +draggableId) {
                return { ...board, ...data };
              }
              return board;
            }),
          };
        } catch (error) {
          // TODO: toast
          console.error(error);
        }
      },
      { revalidate: false },
    );
  };

  return (
    <StyledContainer>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
    </StyledContainer>
  );
};

export default Container;
