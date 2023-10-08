import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';

import { apiCreateCard, apiUploadPDF } from '@/apis';

import useFetchCategories from '@/hooks/useFetchCategories';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useOuterClick from '@/hooks/useOuterClick';
import useFetchBoards from '@/hooks/useFetchBoards';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeCardForm } from '@/store/slices/card';
import { startSpinner, stopSpinner } from '@/store/slices/spinner';

import Form from '@/components/common/Form';

import type { Card } from '@prisma/client';

const StyledCardCreateForm = styled.article`
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

    & > .board-form-pdf-tag-conatiner {
      display: flex;

      & > * {
        flex: 1;
        width: 0;
      }
      & > * + * {
        margin-left: 2em;
      }
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

interface CardCreateFormType extends Pick<Card, 'name' | 'date'> {
  files?: File[];
}

/** 2023/09/20 - Modal CardCreateForm Component - by 1-blue */
const CardCreateForm: React.FC = () => {
  const { boardsMutate } = useFetchBoards();
  const dispatch = useAppDispatch();
  const {
    createState: { defaultCategory, pdfFile },
  } = useAppSelector(state => state.card);

  const { categories } = useFetchCategories();
  const { platforms } = useFetchPlatforms();

  // name & date
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CardCreateFormType>({ defaultValues: { files: [pdfFile] } });

  // category
  const [category, setCategory] = useState(defaultCategory || categories?.[0] || '신규');
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

  /** 2023/09/21 - 카드 생성 요청 핸들러 - by 1-blue */
  const createCard: React.FormEventHandler = handleSubmit(async ({ name, date, files }) => {
    let pdfURL: string | null = null;

    // 1. 이미지 업로드
    if (files?.[0]) {
      dispatch(startSpinner());

      const result = await apiUploadPDF(files[0]);

      if (result?.pdfURL) {
        pdfURL = result.pdfURL;
      }
    }

    // 2. 카드 생성
    apiCreateCard({
      name,
      date,
      pdf: pdfURL,
      platform,
      tags,
      category,
    })
      .then(({ message, data }) => {
        if (!data) return;

        toast.success(message);

        boardsMutate(boards => {
          return {
            ...boards,
            data: boards?.data?.map(board =>
              board.idx === data.boardIdx ? { ...board, cards: [...board.cards, data] } : board,
            ),
          };
        });

        dispatch(stopSpinner());
        dispatch(closeCardForm());
      })
      .catch(console.error);
  });

  const currentFiles = watch('files');
  const resetFile = () => setValue('files', undefined);

  const onClose = () => {
    if (!confirm('폼을 닫으면 작성하신 내용이 저장되지 않습니다.')) return;

    dispatch(closeCardForm());
  };

  const formRef = useOuterClick(onClose);

  return (
    <StyledCardCreateForm ref={formRef}>
      <IoCloseCircle role="button" className="board-form-close-button" onClick={onClose} />

      <h6 className="board-form-title">카드 생성</h6>

      <form onSubmit={createCard} className="board-form">
        <Form.Input
          autoFocus
          type="text"
          id="이름"
          placeholder="ex) 김인턴"
          required
          error={errors.name?.message}
          defaultValue={process.env['NODE_ENV'] === 'development' ? '테스트' : ''}
          {...register('name', {
            required: { value: true, message: '이름을 입력해주세요!' },
            minLength: { value: 2, message: '최소 2자를 입력해주세요!' },
            maxLength: { value: 12, message: '최대 12자를 입력해주세요!' },
          })}
        />
        {categories && (
          <Form.Combobox
            id="카테고리"
            required
            defaultValue={{
              value: defaultCategory || categories?.[0] || '신규',
              label: defaultCategory || categories?.[0] || '신규',
            }}
            value={{ value: category, label: category }}
            options={categories.map(category => ({
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
          <Form.Combobox
            id="플랫폼"
            required
            defaultValue={[
              {
                label: platforms?.[0].platform || '미니인턴',
                value: platforms?.[0].platform || '미니인턴',
              },
            ]}
            value={{ value: platform, label: platform }}
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

        <Form.Input
          type="datetime-local"
          id="마감일"
          required
          defaultValue={new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString().substring(0, 16)}
          error={errors.date?.message}
          {...register('date', {
            required: { value: true, message: '마감일을 입력해주세요!' },
          })}
        />

        <div className="board-form-pdf-tag-conatiner">
          <Form.InputTag id="태그" tags={tags} createTag={createTag} removeTag={removeTag} />

          <Form.InputFile
            {...register('files')}
            type="file"
            id="PDF"
            hidden
            replacementName={currentFiles?.[0]?.name}
            resetFile={resetFile}
            onChange={e => {
              if (e.target.files?.[0]?.type === 'application/pdf') {
                return register('files').onChange(e);
              }

              return toast.error('PDF 형식만 업로드 가능합니다.');
            }}
          />
        </div>

        <div className="board-form-button-wrapper">
          <button type="button" className="board-form-cancel-button" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="board-form-excute-button">
            생성
          </button>
        </div>
      </form>
    </StyledCardCreateForm>
  );
};

export default CardCreateForm;
