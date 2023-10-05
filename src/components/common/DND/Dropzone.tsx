import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { IoCreate } from 'react-icons/io5';
import type { DroppableProps } from 'react-beautiful-dnd';

import { boardCategoryColorTable } from '@/utils/board';

const StyledDropzone = styled.section<{ $category: string }>`
  flex: 1;
  width: 240px;
  height: 100%;

  padding: 1em;

  background-color: ${({ theme }) => theme.colors.gray200};

  border-radius: 0.2em;

  & > .board-wrapper-top {
    display: flex;
    align-items: center;

    margin-bottom: 1em;

    & > * + * {
      margin-left: 0.2em;
    }

    & > #board-wrapper-checkbox {
      width: 20px;
      height: 20px;
    }
    & > .board-wrapper-checkbox-label {
      padding: 0.4em 0.6em;

      letter-spacing: 1.5px;

      border-radius: 1em;
      font-size: ${({ theme }) => theme.fontSize.xs};
      font-weight: bold;

      background-color: ${({ $category }) => boardCategoryColorTable[$category]};
    }
    & > .board-append-button {
      width: 20px;
      height: 20px;
      margin-left: auto;
      padding: 0.1em;

      font-weight: 700;
      font-size: ${({ theme }) => theme.fontSize.xs};
      color: ${({ theme }) => theme.colors.gray500};

      transition: all 0.4s;
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => theme.colors.main600};
      }

      & path {
        pointer-events: none;
      }
    }
  }

  & > .board-wrapper {
    & > * + * {
      margin-top: 0.8em;
    }
  }

  &:has(.board-wrapper-hover) {
    background-color: ${({ theme }) => theme.colors.main200};
  }
`;

//? children이 중복되어서 제외함
interface DropzoneProps extends Omit<DroppableProps, 'children'> {
  category: string;
}

/** 2023/09/19 - 보드들을 감싸는 래퍼 컴포넌트 ( 보드를 사용하기 위한 설정들 적용 ) - by 1-blue */
const Dropzone: React.FC<React.PropsWithChildren<DropzoneProps>> = ({
  category,
  children,
  ...restProps
}) => {
  return (
    <StyledDropzone $category={category}>
      <form className="board-wrapper-top">
        <input type="checkbox" id="board-wrapper-checkbox" />
        <label htmlFor="board-wrapper-checkbox" className="board-wrapper-checkbox-label">
          {category}
        </label>

        <IoCreate role="button" className="board-append-button" data-category={category} />
      </form>

      <Droppable {...restProps}>
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={'board-wrapper' + (snapshot.draggingOverWith ? ' board-wrapper-hover' : '')}
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
