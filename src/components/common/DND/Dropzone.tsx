import { Droppable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';

import type { DroppableProps } from 'react-beautiful-dnd';

const StyledDropzone = styled.ul<{ $isHorizontal: boolean }>`
  display: flex;

  ${({ $isHorizontal }) =>
    $isHorizontal
      ? css`
          flex-direction: row;
          & > * + * {
            margin-left: 1em;
          }
        `
      : css`
          flex-direction: column;
          & > * + * {
            margin-top: 0.6em;
          }
        `}
`;

//? children이 중복되어서 제외함
interface DropzoneProps extends Omit<DroppableProps, 'children'> {}

/** 2023/09/19 - Drag & Drop의 드래그 컴포넌트 - by 1-blue */
const Dropzone: React.FC<React.PropsWithChildren<DropzoneProps>> = ({ children, ...restProps }) => {
  return (
    <Droppable {...restProps}>
      {(provided, snapshot) => (
        <StyledDropzone
          ref={provided.innerRef}
          {...provided.droppableProps}
          $isHorizontal={restProps.direction === 'horizontal'}
          className={snapshot.draggingOverWith ? ' dnd-dropzone-hover' : ''}
        >
          {children}
          {provided.placeholder}
        </StyledDropzone>
      )}
    </Droppable>
  );
};

export default Dropzone;
