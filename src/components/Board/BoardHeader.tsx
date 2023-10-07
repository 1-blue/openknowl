import { useSWRConfig } from 'swr';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import styled from 'styled-components';

import useToggle from '@/hooks/useToggle';

import { apiDeleteBoard } from '@/apis/board';

import Dialog from '@/components/common/Dialog';

import type { ApiFindAllBoardsResponse } from '@/types/apis';

const StyledBoardHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  margin-bottom: 1em;

  & > * + * {
    margin-left: 0.4em;
  }

  & .board-header-checkbox {
    width: 20px;
    height: 20px;

    cursor: pointer;
  }
  & .board-name {
    padding: 0.4em 0.6em;

    letter-spacing: 1.5px;

    border-radius: 1em;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: bold;

    background-color: ${({ theme }) => theme.colors.main300};

    cursor: pointer;
  }

  & .board-option-button {
    margin-left: auto;
    padding: 0.2em;

    border-radius: 50%;
    color: ${({ theme }) => theme.colors.gray600};
    transition: all 0.4s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray300};
      color: ${({ theme }) => theme.colors.gray700};
    }
  }
`;

interface BoardHeaderProps {
  idx: number;
  category: string;
}

/** 2023/10/06 - Board Header Component - by 1-blue */
const BoardHeader: React.FC<BoardHeaderProps> = ({ idx, category }) => {
  const { mutate } = useSWRConfig();
  const { isOpen, onOpen, onClose } = useToggle(false);

  /** 2023/09/21 - Dialog 이벤트 버블링 처리 - by 1-blue */
  const onClickButtonByBubbling: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!(e.target instanceof HTMLElement)) return;
    if (!(e.target instanceof HTMLButtonElement)) return;

    onClose();

    const { type } = e.target.dataset;
    if (!type) return;

    // 삭제
    if (type === 'delete') {
      if (
        !confirm(
          '정말 보드를 삭제하시겠습니까?\n보드를 삭제하면 보드에 등록된 모든 카드도 제거됩니다.',
        )
      ) {
        return;
      }

      // 보드 제거
      mutate<ApiFindAllBoardsResponse, ApiFindAllBoardsResponse>(
        '/board',
        boards => boards && { ...boards, data: boards?.data?.filter(board => board.idx !== idx) },
        { revalidate: false },
      );
      apiDeleteBoard({ idx });
    }
  };

  return (
    <StyledBoardHeader>
      <input type="checkbox" className="board-header-checkbox" />
      <span className="board-name">{category}</span>
      <IoEllipsisVerticalSharp
        role="button"
        className="board-option-button"
        onClick={() => onOpen()}
      />

      {isOpen && (
        <Dialog
          onClose={onClose}
          buttons={[{ type: 'delete', label: '삭제' }]}
          onClickButtonByBubbling={onClickButtonByBubbling}
        />
      )}
    </StyledBoardHeader>
  );
};

export default BoardHeader;
