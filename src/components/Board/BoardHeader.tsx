import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import styled from 'styled-components';

import useToggle from '@/hooks/useToggle';
import useFetchBoards from '@/hooks/useFetchBoards';

import { apiDeleteBoard, apiUpdateBoard } from '@/apis/board';

import Dialog from '@/components/common/Dialog';

const StyledBoardHeader = styled.form`
  position: relative;
  display: flex;
  align-items: center;

  margin-bottom: 0.4em;

  & > * + * {
    margin-left: 0.4em;
  }

  & .board-name-button {
    padding: 0.3em 0.5em;
    text-align: left;

    letter-spacing: 1.5px;
    font-size: ${({ theme }) => theme.fontSize.md};
    font-weight: bold;
    border-radius: 1.6em;
    background-color: ${({ theme }) => theme.colors.main400};
    color: #fff;
  }
  & .board-name-input {
    padding: 0.5em 0.6em;

    letter-spacing: 1.5px;
    font-size: ${({ theme }) => theme.fontSize.xs};
    border: 1.5px solid ${({ theme }) => theme.colors.main500};
    border-radius: 0.2em;

    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  & .board-option-button {
    width: 28px;
    height: 28px;
    padding: 0.4em;
    margin-left: auto;

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
  currentCategory: string;
}

/** 2023/10/06 - Board Header Component - by 1-blue */
const BoardHeader: React.FC<BoardHeaderProps> = ({ idx, currentCategory }) => {
  const { boardsMutate } = useFetchBoards();
  const { isOpen, onOpen, onClose } = useToggle(false);
  const [category, setCategory] = useState(currentCategory);
  const [isInputting, setIsInputting] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);

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
      boardsMutate(
        boards => boards && { ...boards, data: boards?.data?.filter(board => board.idx !== idx) },
      );

      apiDeleteBoard({ idx }).then(({ message }) => {
        toast.info(message);
      });
    }
  };

  /** 2023/10/07 - 보드 수정 - by 1-blue */
  const onUpdateBoard: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!category.trim().length) return toast.error('문자를 입력해주세요!');

    apiUpdateBoard({ idx, currentCategory, category }).then(({ data, message }) => {
      if (!data) return;

      toast.info(message);

      // 보드 수정
      boardsMutate(
        boards =>
          boards && {
            ...boards,
            data: boards.data?.map(board => (board.idx === data.idx ? data : board)),
          },
      );

      inputRef.current?.blur();
    });
  };

  return (
    <StyledBoardHeader onSubmit={onUpdateBoard}>
      {isInputting ? (
        <input
          className="board-name-input"
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          onBlur={() => setIsInputting(false)}
          autoFocus
          ref={inputRef}
        />
      ) : (
        <button type="button" className="board-name-button" onClick={() => setIsInputting(true)}>
          {category}
        </button>
      )}

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
