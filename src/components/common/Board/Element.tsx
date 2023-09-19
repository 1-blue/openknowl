import { Draggable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';

import type { DraggableProps } from 'react-beautiful-dnd';

const StyledElement = styled.li<{ isDragging: boolean }>`
  padding: 0.8em 0.6em;

  border-radius: 0.2em;
  background-color: #fff;
  box-shadow: 0px 0px 6px ${({ theme }) => theme.colors.gray300};

  ${({ isDragging }) =>
    isDragging &&
    css`
      box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.gray500};
    `}

  & > .board-title {
    font-size: 1.6rem;
    font-weight: bold;
  }

  & > .board-description {
  }
`;

interface ElementProps extends Omit<DraggableProps, 'children'> {
  index: number;
}

/** 2023/09/19 - 특정 보드 컴포넌트 ( 드래그 ) - by 1-blue */
const Element: React.FC<React.PropsWithChildren<ElementProps>> = ({ children, ...restProps }) => {
  return (
    <Draggable {...restProps}>
      {(provided, snapshot) => (
        <StyledElement
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          {children}
        </StyledElement>
      )}
    </Draggable>
  );
};

export default Element;
