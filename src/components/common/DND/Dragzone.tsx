import { Draggable } from 'react-beautiful-dnd';

import type { DraggableProps } from 'react-beautiful-dnd';

interface DragzoneProps extends Omit<DraggableProps, 'children'> {}

/** 2023/09/19 - 특정 보드 컴포넌트 ( 드래그 ) - by 1-blue */
const Dragzone: React.FC<React.PropsWithChildren<DragzoneProps>> = ({ children, ...restProps }) => {
  return (
    <Draggable {...restProps}>
      {provided => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {children}
        </li>
      )}
    </Draggable>
  );
};

export default Dragzone;
