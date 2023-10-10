import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

import { apiUpdateCard, apiUploadPDF } from '@/apis';

import { getPDFName } from '@/utils';

import useFetchCategories from '@/hooks/useFetchCategories';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchCard from '@/hooks/useFetchCard';
import useOuterClick from '@/hooks/useOuterClick';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeCardForm } from '@/store/slices/card';
import { startSpinner, stopSpinner } from '@/store/slices/spinner';

import Form from '@/components/common/Form';
import Skeleton from '@/components/common/Skeleton';

import type { Card } from '@prisma/client';

const StyledCardUpdateForm = styled.article`
  position: relative;

  & > .card-form-close-button {
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

  & > .card-form-title {
    padding: 0.6em;

    color: #fff;
    background-color: ${({ theme }) => theme.colors.main400};
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: bold;
    text-align: center;
  }

  & > .card-form {
    padding: 1.6em 2.4em;

    & > * + * {
      margin-top: 1em;
    }

    & > .card-form-pdf-tag-conatiner {
      display: flex;

      & > * {
        flex: 1;
        width: 0;
      }
      & > * + * {
        margin-left: 2em;
      }
    }

    & > .card-form-button-wrapper {
      text-align: end;

      & > * + * {
        margin-left: 0.5em;
      }

      & > .card-form-cancel-button,
      .card-form-excute-button {
        padding: 0.6em 0.8em;

        border: 0;
        border-radius: 0.4em;
        color: #fff;

        cursor: pointer;
        transition: all 0.3s;
      }
      & > .card-form-cancel-button {
        background-color: ${({ theme }) => theme.colors.red400};

        &:hover {
          background-color: ${({ theme }) => theme.colors.red500};
        }
      }
      & > .card-form-excute-button {
        background-color: ${({ theme }) => theme.colors.main400};

        &:hover {
          background-color: ${({ theme }) => theme.colors.main500};
        }
      }
    }
  }
`;

interface CardUpdateFormType extends Pick<Card, 'name' | 'date'> {
  files?: File[];
}

/** 2023/09/20 - Modal BoardUpdateForm Component - by 1-blue */
const CardUpdateForm: React.FC = () => {
  const { mutate } = useSWRConfig();
  const dispatch = useAppDispatch();
  const { targetIdx } = useAppSelector(state => state.card.updateState);

  const { card } = useFetchCard({ idx: targetIdx });
  const { categories } = useFetchCategories();
  const { platforms } = useFetchPlatforms();

  // name & date
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CardUpdateFormType>();

  // category
  const [category, setCategory] = useState(categories?.[0] || '신규');
  // platform
  const [platform, setPlatform] = useState(platforms?.[0].platform || '미니인턴');
  // tags
  const [tags, setTags] = useState<string[]>([]);
  // pdf
  const [pdf, setPDF] = useState<string | null>(null);

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
  const updateBoard: React.FormEventHandler = handleSubmit(async ({ name, date, files }) => {
    let pdfURL: string | null = null;

    // 1. 이미지 업로드
    if (files?.[0]) {
      dispatch(startSpinner());

      const result = await apiUploadPDF(files[0]);

      if (result?.pdfURL) {
        pdfURL = result.pdfURL;
      }
    }

    apiUpdateCard({
      idx: targetIdx,
      name,
      date,
      category,
      platform,
      tags,
      pdf: pdfURL || pdf,
    })
      .then(({ message }) => {
        toast.info(message);

        // TODO: 받은 데이터로 업데이트하기
        mutate('/board');

        dispatch(stopSpinner());
        dispatch(closeCardForm());
      })
      .catch(console.error);
  });

  useEffect(() => {
    if (!card) return;

    setCategory(card.board.category);
    setPlatform(card.platform.platform);
    setTags(card.tags.map(({ tag }) => tag));
    setPDF(card.pdf);
  }, [card]);

  const currentFiles = watch('files');
  const resetFile = () => {
    setValue('files', undefined);
    setPDF(null);
  };

  const onClose = () => {
    if (!confirm('폼을 닫으면 수정하신 내용이 저장되지 않습니다.')) return;

    dispatch(closeCardForm());
  };

  const formRef = useOuterClick(onClose);

  if (!card) return <Skeleton.BoardDetail />;

  return (
    <StyledCardUpdateForm ref={formRef}>
      <IoCloseCircle role="button" className="card-form-close-button" onClick={onClose} />

      <h6 className="card-form-title">보드 수정</h6>

      <form onSubmit={updateBoard} className="card-form">
        <Form.Input
          autoFocus
          type="text"
          id="이름"
          placeholder="ex) 김인턴"
          required
          defaultValue={card.name}
          error={errors.name?.message}
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
              value: card.board.category,
              label: card.board.category,
            }}
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
                label: card.platform.platform,
                value: card.platform.platform,
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

        <Form.Input
          type="datetime-local"
          id="마감일"
          required
          defaultValue={new Date(new Date(card.date).getTime() + 1000 * 60 * 60 * 9)
            .toISOString()
            .substring(0, 16)}
          error={errors.date?.message}
          {...register('date', {
            required: { value: true, message: '마감일을 입력해주세요!' },
          })}
        />

        <div className="card-form-pdf-tag-conatiner">
          <Form.InputTag id="태그" tags={tags} createTag={createTag} removeTag={removeTag} />

          <Form.InputFile
            {...register('files')}
            type="file"
            id="PDF"
            hidden
            replacementName={currentFiles?.[0]?.name || getPDFName(pdf || '')}
            resetFile={resetFile}
            onChange={e => {
              if (e.target.files?.[0]?.type === 'application/pdf') {
                return register('files').onChange(e);
              }

              return toast.error('PDF 형식만 업로드 가능합니다.');
            }}
          />
        </div>

        <div className="card-form-button-wrapper">
          <button type="button" className="card-form-cancel-button" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="card-form-excute-button">
            수정
          </button>
        </div>
      </form>
    </StyledCardUpdateForm>
  );
};

export default CardUpdateForm;
