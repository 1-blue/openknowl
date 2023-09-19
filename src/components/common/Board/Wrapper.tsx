import { Category } from '@/types';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import type { DroppableProps } from 'react-beautiful-dnd';

import { boardCategoryColorTable, boardCategoryNameTable } from '@/utils/board';

const StyledWrapper = styled.section<{ category: Category }>`
  flex: 1;
  width: 0px;

  padding: 1em;

  background-color: ${({ theme }) => theme.colors.gray200};

  border-radius: 0.2em;

  & > .board-wrapper-title {
    display: flex;
    align-items: center;

    margin-bottom: 1em;

    & > * + * {
      margin-left: 0.2em;
    }

    & > .board-wrapper-checkbox {
    }
    & > .board-wrapper-checkbox-label {
      padding: 0.4em 0.6em;

      letter-spacing: 1.5px;

      border-radius: 1em;
      font-size: ${({ theme }) => theme.fontSize.xs};

      background-color: ${({ category }) => boardCategoryColorTable[category]};
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
interface WrapperProps extends Omit<DroppableProps, 'children'> {
  category: Category;
}

/** 2023/09/19 - 보드들을 감싸는 래퍼 컴포넌트 ( 보드를 사용하기 위한 설정들 적용 ) - by 1-blue */
const Wrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  category,
  children,
  ...restProps
}) => {
  return (
    <StyledWrapper category={category}>
      <form className="board-wrapper-title">
        <input type="checkbox" id="board-wrapper-checkbox" />
        <label htmlFor="board-wrapper-checkbox" className="board-wrapper-checkbox-label">
          {boardCategoryNameTable[category]}
        </label>
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
    </StyledWrapper>
  );
};

export default Wrapper;
