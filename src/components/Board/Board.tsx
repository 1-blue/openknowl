import { useState } from 'react';
import { useSWRConfig } from 'swr';
import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';
import { IoEllipsisVerticalSharp, IoTimeOutline, IoAttach } from 'react-icons/io5';

import { apiDeleteBoard } from '@/apis';

import { useAppDispatch } from '@/store';
import { openBoardForm } from '@/store/slices/board';

import { dateFormat, futureTimeFormat, pastTimeFormat } from '@/utils/time';

import BoardDialog from '@/components/Board/BoardDialog';

import type { BoardWithETC } from '@/types/apis';

const StyledBoard = styled.div<{ $isPast: boolean }>`
  position: relative;
  padding: 0.8em 0.6em;

  border-radius: 0.2em;
  background-color: #fff;
  box-shadow: 0px 0px 6px ${({ theme }) => theme.colors.gray300};

  ${({ $isPast }) =>
    $isPast &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.red300};
      box-shadow: 0px 0px 6px ${({ theme }) => theme.colors.red200};
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

      border-radius: 50%;
      color: ${({ theme }) => theme.colors.gray400};
      transition: all 0.4s;

      &:hover {
        background-color: ${({ theme }) => theme.colors.gray200};
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
    pointer-events: none;

    & > .board-bottom-wrapper {
      display: flex;
      align-items: center;

      & > * + * {
        margin-left: 0.4em;
      }

      & > .board-clock-icon {
        width: 16px;
        height: 16px;
        margin-right: 0.1em;

        color: ${({ theme }) => theme.colors.gray400};
      }
      & > .board-date {
        display: block;

        color: ${({ theme }) => theme.colors.gray400};
        font-size: 0.6rem;
        font-weight: 600;
      }
    }
    & > .board-clip-icon {
      width: 20px;
      height: 20px;

      color: ${({ theme }) => theme.colors.main400};
    }
  }
`;

interface BoardProps
  extends Pick<BoardWithETC, 'idx' | 'name' | 'date' | 'platform' | 'tags' | 'pdf'> {}

/** 2023/10/05 - Board Component - by 1-blue */
const Board: React.FC<BoardProps> = ({ idx, name, date, platform, tags, pdf }) => {
  const { mutate } = useSWRConfig();
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
  const onOpenDialogByBubbling: React.MouseEventHandler<HTMLDivElement> = e => {
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

        mutate('/board');
      });
    }
  };

  const isPast = Date.now() - new Date(date).getTime() > 0;

  return (
    <StyledBoard $isPast={isPast} data-target-idx={idx}>
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
      <button type="button" className="board-platform" data-platform={platform.platform}>
        {platform.platform}
      </button>
      <ul className="board-tag-container">
        {tags.map(({ tag }) => (
          <li key={tag} className="board-tag" role="button" data-tag={tag}>
            {tag}
          </li>
        ))}
      </ul>
      <div className="board-bottom-container">
        <div className="board-bottom-wrapper">
          <IoTimeOutline className="board-clock-icon" />
          <time className="board-date">{dateFormat(date, 'YYYY.MM.DD')}</time>
          <time className="board-date">{dateFormat(date, 'hh:mm:ss')}</time>
          <time className="board-date">
            ( {isPast ? `-${pastTimeFormat(date)}` : `+${futureTimeFormat(date)}`} )
          </time>
        </div>

        {pdf && <IoAttach className="board-clip-icon" />}
      </div>
      {isShowDialog && (
        <div onClick={onOpenDialogByBubbling} style={{ margin: 0 }}>
          <BoardDialog onClose={onCloseDialog} pdfURL={pdf} />
        </div>
      )}
    </StyledBoard>
  );
};

export default Board;
