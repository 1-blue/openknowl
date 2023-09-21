import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeBoardModal } from '@/store/slices/boardModal';

import Input from '@/components/common/Input';
import Combobox from '@/components/common/Combobox';
import Tag from '@/components/common/Tag';

import type { Board } from '@prisma/client';

const StyledBoardFormWrapper = styled.article`
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

interface CreateBoardBoardForm extends Pick<Board, 'name' | 'date'> {}

// FIXME: 임시
const categories = ['신규', '검토', '1차면접', '2차면접', '서류합격', '최종합격', '불합격'];
const platforms = ['원티드', '사람인', '로켓펀치', '미니인턴', '잡플래닛'];

/** 2023/09/20 - Modal BoardForm Component - by 1-blue */
const BoardForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { category: defaultCategoty } = useAppSelector(state => state.boardModal);

  // name & date
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBoardBoardForm>();

  // category
  const [category, setCategory] = useState(categories[0]);
  // platform
  const [playforms, setPlatforms] = useState([platforms[0]]);
  // tags
  const [tags, setTags] = useState<string[]>([]);

  /** 2023/09/21 - 태그 생성 - by 1-blue */
  const createTag = (tag: string) => {
    if (tags.find(v => v === tag)) {
      // TODO: toast
      alert('이미 등록된 태그입니다.');
      return;
    }

    setTags(prev => [...prev, tag]);
  };
  /** 2023/09/21 - 태그 제거 - by 1-blue */
  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(v => v !== tag));
  };

  /** 2023/09/21 - 보드 생성 요청 핸들러 - by 1-blue */
  const createBoard: React.FormEventHandler = handleSubmit(({ name, date }) => {
    console.log('body >> ', name, date, category, playforms, tags);
  });

  return (
    <StyledBoardFormWrapper>
      <IoCloseCircle
        className="board-form-close-button"
        onClick={() => dispatch(closeBoardModal())}
      />

      <h6 className="board-form-title">보드 생성</h6>

      <form onSubmit={createBoard} className="board-form">
        <Input
          type="text"
          id="이름"
          placeholder="ex) 김인턴"
          required
          error={errors.name?.message}
          {...register('name', {
            required: { value: true, message: '이름을 입력해주세요!' },
            minLength: { value: 2, message: '최소 2자를 입력해주세요!' },
            maxLength: { value: 12, message: '최대 12자를 입력해주세요!' },
          })}
        />

        <Combobox
          id="카테고리"
          required
          defaultValue={{ value: defaultCategoty, label: defaultCategoty }}
          options={categories.map(category => ({ value: category, label: category }))}
          onChange={selected => {
            if (!selected) return;
            if (selected instanceof Array) return;

            setCategory(selected.value);
          }}
        />

        <Combobox
          isMulti
          id="플랫폼"
          required
          defaultValue={[{ value: platforms[0], label: playforms[0] }]}
          options={platforms.map(platform => ({ value: platform, label: platform }))}
          onChange={selected => {
            if (!selected) return;
            if (!(selected instanceof Array)) return;

            setPlatforms(selected.map(v => v.value));
          }}
        />

        <Input
          type="datetime-local"
          id="마감일"
          required
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
            생성
          </button>
        </div>
      </form>
    </StyledBoardFormWrapper>
  );
};

export default BoardForm;
