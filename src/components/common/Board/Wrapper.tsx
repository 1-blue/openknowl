import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import type { DroppableProps } from 'react-beautiful-dnd';

import { useAppDispatch } from '@/store';
import { openBoardModal } from '@/store/slices/boardModal';
import { boardCategoryColorTable } from '@/utils/board';

const StyledWrapper = styled.section<{ $category: string }>`
  flex: 1;
  width: 240px;

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

      background-color: ${({ $category }) => boardCategoryColorTable[$category]};
    }
    & > .board-append-button {
      margin-left: auto;
      padding: 0.4em 0.6em;

      font-weight: 700;
      color: ${({ theme }) => theme.colors.main400};
      border: 2px solid ${({ theme }) => theme.colors.main300};
      border-radius: 0.6em;

      transition: all 0.4s;
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => theme.colors.main600};
        border: 2px solid ${({ theme }) => theme.colors.main500};
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
interface WrapperProps extends Omit<DroppableProps, 'children'> {
  category: string;
}

/** 2023/09/19 - 보드들을 감싸는 래퍼 컴포넌트 ( 보드를 사용하기 위한 설정들 적용 ) - by 1-blue */
const Wrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  category,
  children,
  ...restProps
}) => {
  const dispatch = useAppDispatch();

  return (
    <StyledWrapper $category={category}>
      <form className="board-wrapper-top">
        <input type="checkbox" id="board-wrapper-checkbox" />
        <label htmlFor="board-wrapper-checkbox" className="board-wrapper-checkbox-label">
          {category}
        </label>

        <button
          type="button"
          className="board-append-button"
          onClick={() => dispatch(openBoardModal({ category }))}
        >
          + 보드 추가
        </button>
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
