import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import type { DroppableProps } from 'react-beautiful-dnd';

const StyledDropzone = styled.section`
  flex: 1;
  width: 240px;
  height: 100%;

  & .dnd-dropzone {
    & > * + * {
      margin-top: 0.8em;
    }
  }
`;

//? children이 중복되어서 제외함
interface DropzoneProps extends Omit<DroppableProps, 'children'> {}

/** 2023/09/19 - 보드들을 감싸는 래퍼 컴포넌트 ( 보드를 사용하기 위한 설정들 적용 ) - by 1-blue */
const Dropzone: React.FC<React.PropsWithChildren<DropzoneProps>> = ({ children, ...restProps }) => {
  return (
    <StyledDropzone>
      <Droppable {...restProps}>
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={'dnd-dropzone' + (snapshot.draggingOverWith ? ' dnd-dropzone-hover' : '')}
          >
            {children}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </StyledDropzone>
  );
};

export default Dropzone;
