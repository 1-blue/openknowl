import { useState } from 'react';
import { mutate } from 'swr';
import { Draggable } from 'react-beautiful-dnd';
import { IoEllipsisVerticalSharp, IoTimeOutline } from 'react-icons/io5';
import styled, { css } from 'styled-components';

import { apiDeleteBoard } from '@/apis';

import { dateFormat, timeFormat } from '@/utils/time';
import { platformNameTable } from '@/utils/board';

import BoardDialog from '@/components/Board/BoardDialog';

import type { DraggableProps } from 'react-beautiful-dnd';
import type { ApiFindAllBoardsResponse, BoardWithTags } from '@/types/apis';

const StyledElement = styled.li<{ isDragging: boolean }>`
  position: relative;
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
    align-items: center;

    & > .board-top-wrapper {
      display: flex;

      & > .board-checkbox {
        width: 16px;
        height: 16px;
      }
      & > .board-name {
        margin-left: 0.2em;

        line-height: 1.3em;
        font-size: ${({ theme }) => theme.fontSize.xl};
        font-weight: bold;
      }
    }
    & > .board-option-button {
      margin-left: auto;
      padding: 0.2em;

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
      font-size: ${({ theme }) => theme.fontSize.sm};
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

      font-size: ${({ theme }) => theme.fontSize.xs};
      font-weight: 600;
      color: ${({ theme }) => theme.colors.gray400};
    }
  }
`;

interface ElementProps
  extends Omit<DraggableProps, 'children'>,
    Pick<BoardWithTags, 'idx' | 'name' | 'date' | 'platform' | 'tags'> {
  index: number;
}

/** 2023/09/19 - 특정 보드 컴포넌트 ( 드래그 ) - by 1-blue */
const Element: React.FC<React.PropsWithChildren<ElementProps>> = ({
  idx,
  name,
  date,
  platform,
  tags,
  children,
  ...restProps
}) => {
  const [isShowDialog, setIsShowDialog] = useState(false);

  /** 2023/09/21 - Dialog 닫기 - by 1-blue */
  const onOpenDialog = () => {
    setIsShowDialog(true);
  };
  /** 2023/09/21 - Dialog 열기 - by 1-blue */
  const onCloseDialog = () => {
    setIsShowDialog(false);
  };

  /** 2023/09/21 - Dialog 이벤트 버블링 처리 - by 1-blue */
  const onBubblingDialog: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!(e.target instanceof HTMLElement)) return;

    onCloseDialog();

    const { type } = e.target.dataset;

    // 버튼이 아니라면
    if (!(e.target instanceof HTMLButtonElement)) return;
    if (!type) return;

    // 수정
    if (type === 'update') {
      // TODO: 수정 모달 띄우기
    }
    // 삭제
    if (type === 'delete') {
      apiDeleteBoard({ idx }).then(() => {
        // TODO: toast
        // TODO: 삭제된 보드의 order 변경
        mutate<ApiFindAllBoardsResponse, ApiFindAllBoardsResponse>(
          '/board',
          boards =>
            boards && {
              ...boards,
              data: boards.data && boards.data.filter(board => board.idx !== idx),
            },
        );
      });
    }
  };

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
            <IoEllipsisVerticalSharp
              role="button"
              className="board-option-button"
              onClick={onOpenDialog}
            />
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
          {isShowDialog && (
            <div onClick={onBubblingDialog} style={{ margin: 0 }}>
              <BoardDialog onClose={onCloseDialog} />
            </div>
          )}
        </StyledElement>
      )}
    </Draggable>
  );
};

export default Element;
