import { useState } from 'react';
import { mutate } from 'swr';
import { Draggable } from 'react-beautiful-dnd';
import { IoEllipsisVerticalSharp, IoTimeOutline, IoAttach } from 'react-icons/io5';
import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';

import { apiDeleteBoard } from '@/apis';

import { useAppDispatch } from '@/store';
import { openBoardForm } from '@/store/slices/board';

import { dateFormat, futureTimeFormat, pastTimeFormat } from '@/utils/time';

import BoardDialog from '@/components/Board/BoardDialog';

import type { DraggableProps } from 'react-beautiful-dnd';
import type { BoardWithETC } from '@/types/apis';

const StyledDragzone = styled.li<{ $isDragging: boolean }>`
  position: relative;
  padding: 0.8em 0.6em;

  border-radius: 0.2em;
  background-color: #fff;
  box-shadow: 0px 0px 6px ${({ theme }) => theme.colors.gray300};

  ${({ $isDragging }) =>
    $isDragging &&
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
    justify-content: space-between;

    & > .board-bottom-wrapper {
      display: flex;
      align-items: center;

      & > .board-clock-icon {
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
    & > .board-clip-icon {
      width: 20px;
      height: 20px;

      color: ${({ theme }) => theme.colors.main400};
    }
  }
`;

interface DragzoneProps
  extends Omit<DraggableProps, 'children'>,
    Pick<BoardWithETC, 'idx' | 'name' | 'date' | 'category' | 'platform' | 'tags' | 'pdf'> {
  index: number;
}

/** 2023/09/19 - 특정 보드 컴포넌트 ( 드래그 ) - by 1-blue */
const Dragzone: React.FC<React.PropsWithChildren<DragzoneProps>> = ({
  idx,
  name,
  date,
  platform,
  tags,
  pdf,
  children,
  ...restProps
}) => {
  const dispatch = useAppDispatch();

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
      dispatch(openBoardForm({ idx }));
    }
    // 삭제
    if (type === 'delete') {
      apiDeleteBoard({ idx }).then(({ message, data }) => {
        if (!data) return;

        toast.success(message);

        // TODO:
        mutate('/board');
      });
    }
  };

  return (
    <Draggable {...restProps}>
      {(provided, snapshot) => (
        <StyledDragzone
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $isDragging={snapshot.isDragging}
          data-target-idx={idx}
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
          <span className="board-platform">{platform.platform}</span>
          <ul className="board-tag-container">
            {tags.map(({ tag }) => (
              <li key={tag} className="board-tag">
                {tag}
              </li>
            ))}
          </ul>
          <div className="board-bottom-container">
            <div className="board-bottom-wrapper">
              <IoTimeOutline className="board-clock-icon" />
              <time className="board-date">
                {dateFormat(date, 'YYYY.MM.DD')} ({' '}
                {Date.now() - new Date(date).getTime() > 0
                  ? `-${pastTimeFormat(date)}`
                  : `+${futureTimeFormat(date)}`}
                )
              </time>
            </div>

            {pdf && <IoAttach className="board-clip-icon" />}
          </div>
          {isShowDialog && (
            <div onClick={onBubblingDialog} style={{ margin: 0 }}>
              <BoardDialog onClose={onCloseDialog} pdfURL={pdf} />
            </div>
          )}
        </StyledDragzone>
      )}
    </Draggable>
  );
};

export default Dragzone;