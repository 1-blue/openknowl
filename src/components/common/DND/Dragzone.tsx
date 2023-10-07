import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import type { DraggableProps } from 'react-beautiful-dnd';

interface DragzoneProps extends Omit<DraggableProps, 'children'> {}

/** 2023/09/19 - Drag & Drop의 드래그 컴포넌트 - by 1-blue */
const Dragzone: React.FC<React.PropsWithChildren<DragzoneProps>> = ({ children, ...restProps }) => {
  return (
    <Draggable {...restProps} key={restProps.draggableId}>
      {provided => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {children}
        </li>
      )}
    </Draggable>
  );
};

export default React.memo(Dragzone);
