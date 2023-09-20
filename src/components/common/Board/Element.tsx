import { Draggable } from 'react-beautiful-dnd';
import { IoEllipsisVerticalSharp, IoTimeOutline } from 'react-icons/io5';
import styled, { css } from 'styled-components';

import { dateFormat, timeFormat } from '@/utils/time';
import { platformNameTable } from '@/utils/board';

import type { DraggableProps } from 'react-beautiful-dnd';
import type { BoardWithTags } from '@/types/apis';

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

  & > * + * {
    margin-top: 1em;
  }

  & > .board-top-container {
    display: flex;

    & > .board-top-wrapper {
      display: flex;

      & > .board-checkbox {
        width: 16px;
        height: 16px;
      }
      & > .board-name {
        margin-left: 0.2em;

        font-size: ${({ theme }) => theme.fontSize['2xl']};
        font-weight: bold;
      }
    }
    & > .board-option-button {
      margin-left: auto;

      color: ${({ theme }) => theme.colors.gray400};
      transition: all 0.4s;

      &:hover {
        color: ${({ theme }) => theme.colors.gray600};
      }
    }
  }
  & > .board-platform {
    display: inline-block;
    padding: 0.2em 0.4em;

    border-radius: 0.5em;
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray600};
    font-weight: 500;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    background-color: ${({ theme }) => theme.colors.gray100};
  }
  & .board-tag-container {
    display: flex;
    flex-flow: row wrap;
    gap: 0.6em;

    & > .board-tag {
      padding: 0.4em;

      border-radius: 0.8em;
      font-size: ${({ theme }) => theme.fontSize.lg};
      color: ${({ theme }) => theme.colors.main600};
      background-color: ${({ theme }) => theme.colors.main100};
    }
  }
  & > .board-bottom-container {
    display: flex;
    align-items: center;

    & > .board-clock {
      width: 16px;
      height: 16px;
      margin-right: 0.4em;

      color: ${({ theme }) => theme.colors.gray400};
    }
    & > .board-date {
      display: block;

      font-size: ${({ theme }) => theme.fontSize.sm};
      font-weight: 600;
      color: ${({ theme }) => theme.colors.gray400};
    }
  }
`;

interface ElementProps
  extends Omit<DraggableProps, 'children'>,
    Pick<BoardWithTags, 'name' | 'date' | 'platform' | 'tags'> {
  index: number;
}

/** 2023/09/19 - 특정 보드 컴포넌트 ( 드래그 ) - by 1-blue */
const Element: React.FC<React.PropsWithChildren<ElementProps>> = ({
  name,
  date,
  platform,
  tags,
  children,
  ...restProps
}) => {
  return (
    <Draggable {...restProps}>
      {(provided, snapshot) => (
        <StyledElement
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <div className="board-top-container">
            <div className="board-top-wrapper">
              <input type="checkbox" className="board-checkbox" />
              <span className="board-name">{name}</span>
            </div>
            <IoEllipsisVerticalSharp role="button" className="board-option-button" />
          </div>
          <span className="board-platform">{platformNameTable[platform]}</span>
          <ul className="board-tag-container">
            {tags.map(({ tag }) => (
              <li key={tag} className="board-tag">
                {tag}
              </li>
            ))}
          </ul>
          <div className="board-bottom-container">
            <IoTimeOutline className="board-clock" />
            <time className="board-date">
              {dateFormat(new Date(date), 'YYYY.MM.DD')} (+{timeFormat(new Date(date))})
            </time>
          </div>
        </StyledElement>
      )}
    </Draggable>
  );
};

export default Element;
