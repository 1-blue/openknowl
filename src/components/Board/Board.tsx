import styled from 'styled-components';

import BoardHeader from '@/components/Board/BoardHeader';
import DND from '@/components/common/DND';
import Card from '@/components/Card/Card';
import CardCreateButton from '@/components/Card/CardCreateButton';

import type { BoardWithETC } from '@/types/apis';

const StyledBoard = styled.section`
  width: 280px;
  padding: 1em;

  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: 0.2em;
  box-shadow: 2px 2px 8px ${({ theme }) => theme.colors.gray400};

  &:has(.dnd-dropzone-is-dragging-over) {
    background-color: ${({ theme }) => theme.colors.main200};
  }
`;

interface BoardProps extends BoardWithETC {}

/** 2023/10/08 - Board Component - by 1-blue */
const Board: React.FC<BoardProps> = ({ idx, category, cards }) => {
  return (
    <StyledBoard>
      <BoardHeader idx={idx} currentCategory={category} />

      <CardCreateButton category={category} />

      {/* Card 드랍 영역 지정 */}
      <DND.Dropzone droppableId={'BOARD-' + idx} type="CARD" direction="vertical">
        {cards.map(card => (
          // Card 드래그 영역 지정
          <DND.Dragzone
            key={'CARD-' + card.idx}
            draggableId={'CARD-' + card.idx}
            index={card.order}
          >
            <Card {...card} />
          </DND.Dragzone>
        ))}
      </DND.Dropzone>
    </StyledBoard>
  );
};

export default Board;
