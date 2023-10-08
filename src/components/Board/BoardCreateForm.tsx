import { useState } from 'react';
import styled from 'styled-components';
import { IoAdd } from 'react-icons/io5';
import { toast } from 'react-toastify';

import { apiCreateBoard } from '@/apis/board';

import useFetchBoards from '@/hooks/useFetchBoards';

const StyledBoardCreateForm = styled.form`
  place-self: start;
  width: 240px;
  padding: 1em;
  margin-left: 1em;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.gray300};
  border-radius: 0.4em;

  transition: all 0.4s;
  cursor: pointer;

  & .board-create-button-icon {
    width: 36px;
    height: 36px;

    color: #fff;
  }

  & .board-create-input {
    width: 100%;
    padding: 0.4em 0.6em;

    border: 2px solid ${({ theme }) => theme.colors.main400};
    border-radius: 0.2em;

    &:focus {
      outline: none;
    }
  }

  & .board-create-button-container {
    place-self: end;
    margin-top: 0.6em;
  }

  & .board-create-button {
    padding: 0.3em 0.4em;
    margin-left: 0.6em;

    color: ${({ theme }) => theme.colors.main500};
    border: 1.5px solid ${({ theme }) => theme.colors.main500};
    border-radius: 0.2em;
    background-color: transparent;

    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.main500};
      color: #fff;
    }
  }
`;

type BoardCreateFormState = 'waiting' | 'inputting';

/** 2023/10/06 - Board Create Button Component - by 1-blue */
const BoardCreateForm: React.FC = () => {
  const { boardsMutate } = useFetchBoards();
  const [state, setState] = useState<BoardCreateFormState>('waiting');
  const [category, setCategory] = useState('');

  /** 2023/10/07 - 보드 생성 - by 1-blue */
  const onCreateBoard: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!category.trim().length) return toast.error('문자를 입력해주세요!');

    apiCreateBoard({ category }).then(({ data }) => {
      if (!data) return;

      boardsMutate(
        boards =>
          boards && {
            ...boards,
            data: boards.data ? [...boards.data, data] : [],
          },
      );

      setCategory('');
    });
  };

  return (
    <StyledBoardCreateForm onClick={() => setState('inputting')} onSubmit={onCreateBoard}>
      {state === 'waiting' ? (
        <IoAdd className="board-create-button-icon" />
      ) : (
        <>
          <input
            type="text"
            className="board-create-input"
            value={category}
            onChange={e => setCategory(e.target.value)}
            autoFocus
          />
          <div className="board-create-button-container">
            <button
              type="button"
              className="board-create-button"
              onClick={e => {
                e.stopPropagation();
                setState('waiting');
              }}
            >
              닫기
            </button>
            <button type="submit" className="board-create-button">
              생성
            </button>
          </div>
        </>
      )}
    </StyledBoardCreateForm>
  );
};

export default BoardCreateForm;
