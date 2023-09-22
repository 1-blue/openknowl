import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

import { apiUpdateBoard } from '@/apis';
import useFetchCategories from '@/hooks/useFetchCategoriesOfBoard';
import useFetchPlatforms from '@/hooks/useFetchPlatformsOfBoard';
import useFetchBoard from '@/hooks/useFetchBoard';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeBoardModal } from '@/store/slices/boardModal';

import Input from '@/components/common/Input';
import Combobox from '@/components/common/Combobox';
import Tag from '@/components/common/Tag';

import type { Board } from '@prisma/client';

const StyledBoardUpdateFormWrapper = styled.article`
  position: relative;

  & > .board-form-close-button {
    position: absolute;
    top: 0.9em;
    left: 0.6em;

    color: ${({ theme }) => theme.colors.red300};
    width: 24px;
    height: 24px;

    transition: all 0.4s;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.red400};
    }
  }

  & > .board-form-title {
    padding: 0.6em;

    color: #fff;
    background-color: ${({ theme }) => theme.colors.main400};
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: bold;
    text-align: center;
  }

  & > .board-form {
    padding: 1.6em 2.4em;

    & > * + * {
      margin-top: 1em;
    }

    & > .board-form-button-wrapper {
      text-align: end;

      & > * + * {
        margin-left: 0.5em;
      }

      & > .board-form-cancel-button,
      .board-form-excute-button {
        padding: 0.6em 0.8em;

        border: 0;
        border-radius: 0.4em;
        color: #fff;

        cursor: pointer;
        transition: all 0.3s;
      }
      & > .board-form-cancel-button {
        background-color: ${({ theme }) => theme.colors.red400};

        &:hover {
          background-color: ${({ theme }) => theme.colors.red500};
        }
      }
      & > .board-form-excute-button {
        background-color: ${({ theme }) => theme.colors.main400};

        &:hover {
          background-color: ${({ theme }) => theme.colors.main500};
        }
      }
    }
  }
`;

interface BoardUpdateForm extends Pick<Board, 'name' | 'date'> {}

/** 2023/09/20 - Modal BoardUpdateForm Component - by 1-blue */
const BoardUpdateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { targetIdx } = useAppSelector(state => state.boardModal);

  const { board } = useFetchBoard({ idx: targetIdx });
  const { categories } = useFetchCategories();
  const { platforms } = useFetchPlatforms();

  // name & date
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardUpdateForm>();

  // category
  const [category, setCategory] = useState(categories?.[0].category || '신규');
  // platform
  const [platform, setPlatform] = useState(platforms?.[0].platform || '미니인턴');
  // tags
  const [tags, setTags] = useState<string[]>([]);

  /** 2023/09/21 - 태그 생성 - by 1-blue */
  const createTag = (tag: string) => {
    if (tags.find(v => v === tag)) {
      return toast.warning('이미 등록된 태그입니다.');
    }

    setTags(prev => [...prev, tag]);
  };
  /** 2023/09/21 - 태그 제거 - by 1-blue */
  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(v => v !== tag));
  };

  /** 2023/09/21 - 보드 수정 요청 핸들러 - by 1-blue */
  const updateBoard: React.FormEventHandler = handleSubmit(({ name, date }) => {
    apiUpdateBoard({
      idx: targetIdx,
      name,
      date,
      category,
      platform,
      tags,
    })
      .then(({ message }) => {
        toast.success(message);

        // TODO:
        mutate('/board');
      })
      // FIXME:
      .catch(console.error);
  });

  useEffect(() => {
    if (!board) return;

    setCategory(board.category.category);
    setPlatform(board.platform.platform);
    setTags(board.tags.map(({ tag }) => tag));
  }, [board]);

  // TODO: skeleton UI
  if (!board) return <></>;

  return (
    <StyledBoardUpdateFormWrapper>
      <IoCloseCircle
        className="board-form-close-button"
        onClick={() => dispatch(closeBoardModal())}
      />

      <h6 className="board-form-title">보드 수정</h6>

      <form onSubmit={updateBoard} className="board-form">
        <Input
          type="text"
          id="이름"
          placeholder="ex) 김인턴"
          required
          defaultValue={board.name}
          error={errors.name?.message}
          {...register('name', {
            required: { value: true, message: '이름을 입력해주세요!' },
            minLength: { value: 2, message: '최소 2자를 입력해주세요!' },
            maxLength: { value: 12, message: '최대 12자를 입력해주세요!' },
          })}
        />

        {categories && (
          <Combobox
            id="카테고리"
            required
            defaultValue={{
              value: board.category.category,
              label: board.category.category,
            }}
            options={categories.map(({ category }) => ({
              label: category,
              value: category,
            }))}
            onChange={selected => {
              if (!selected) return;
              if (selected instanceof Array) return;

              setCategory(selected.value);
            }}
          />
        )}

        {platforms && (
          <Combobox
            id="플랫폼"
            required
            defaultValue={[
              {
                label: board.platform.platform,
                value: board.platform.platform,
              },
            ]}
            options={platforms.map(({ platform }) => ({
              label: platform,
              value: platform,
            }))}
            onChange={selected => {
              if (!selected) return;
              if (selected instanceof Array) return;

              setPlatform(selected.value);
            }}
          />
        )}

        <Input
          type="datetime-local"
          id="마감일"
          required
          // TODO:
          defaultValue={Date.now()}
          error={errors.date?.message}
          {...register('date', {
            required: { value: true, message: '마감일을 입력해주세요!' },
          })}
        />

        <Tag id="태그" tags={tags} createTag={createTag} removeTag={removeTag} />

        <div className="board-form-button-wrapper">
          <button
            type="button"
            className="board-form-cancel-button"
            onClick={() => dispatch(closeBoardModal())}
          >
            취소
          </button>
          <button type="submit" className="board-form-excute-button">
            수정
          </button>
        </div>
      </form>
    </StyledBoardUpdateFormWrapper>
  );
};

export default BoardUpdateForm;
