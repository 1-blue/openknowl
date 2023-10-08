import useFetchBoards from '@/hooks/useFetchBoards';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const StyledBoard = styled.ul`
  padding: 1em;
  margin: 1em 0 0 1em;
  background-color: lightcoral;
`;

const StyledCard = styled.div`
  padding: 1em;
  margin: 0.5em 0 0 0;
  background-color: lightblue;
`;

const Page = () => {
  const { boards } = useFetchBoards();

  const onDragEnd = (props: DropResult) => {
    console.log('props >> ', props);
  };

  if (!boards) return <></>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* 보드 드랍 영역 */}
      <Droppable droppableId={'BOARD'} type="BOARD" direction="horizontal">
        {provided => (
          // 보드 드랍 영역
          <ul ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex' }}>
            {boards.map((board, index) => (
              // 보드 드래그 영역
              <Draggable key={'board' + board.idx} draggableId={'board' + board.idx} index={index}>
                {provided => (
                  // 보드 드래그 영역
                  <StyledBoard ref={provided.innerRef} {...provided.draggableProps}>
                    <div {...provided.dragHandleProps}>head</div>
                    {/* 카드 드랍 영역 */}
                    <Droppable droppableId={board.idx + ''} type="CARD" direction="vertical">
                      {provided => (
                        // 카드 드랍 영역
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {board.cards.map((card, index) => (
                            <li key={card.idx}>
                              <Draggable
                                key={'card' + card.idx}
                                draggableId={'card' + card.idx}
                                index={index}
                              >
                                {provided => (
                                  <StyledCard
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {card.name}
                                  </StyledCard>
                                )}
                              </Draggable>
                            </li>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </StyledBoard>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Page;
