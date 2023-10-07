import { useState } from 'react';
import { useSWRConfig } from 'swr';
import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';
import { IoEllipsisVerticalSharp, IoTimeOutline, IoAttach } from 'react-icons/io5';

import { apiDeleteCard } from '@/apis';

import { useAppDispatch } from '@/store';
import { openCardForm } from '@/store/slices/card';

import { dateFormat, futureTimeFormat, pastTimeFormat } from '@/utils/time';

import CardDialog from '@/components/Card/CardDialog';

import type { CardWithETC } from '@/types/apis';

const StyledCard = styled.div<{ $isPast: boolean }>`
  width: 240px;
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

  & > .card-top-container {
    display: flex;
    align-items: center;

    & > .card-top-wrapper {
      display: flex;

      & > .card-checkbox {
        width: 16px;
        height: 16px;
      }
      & > .card-name {
        margin-left: 0.2em;

        line-height: 1.3em;
        font-size: ${({ theme }) => theme.fontSize.xl};
        font-weight: bold;
      }
    }
    & > .card-option-button {
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
  & > .card-platform {
    display: inline-block;
    padding: 0.2em 0.4em;

    border-radius: 0.5em;
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray600};
    font-weight: 500;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    background-color: ${({ theme }) => theme.colors.gray100};
  }
  & .card-tag-container {
    display: flex;
    flex-flow: row wrap;
    gap: 0.6em;

    & > .card-tag {
      padding: 0.4em;

      border-radius: 0.8em;
      font-size: ${({ theme }) => theme.fontSize.sm};
      color: ${({ theme }) => theme.colors.main600};
      background-color: ${({ theme }) => theme.colors.main100};
    }
  }
  & > .card-bottom-container {
    display: flex;
    justify-content: space-between;
    pointer-events: none;

    & > .card-bottom-wrapper {
      display: flex;
      align-items: center;

      & > * + * {
        margin-left: 0.4em;
      }

      & > .card-clock-icon {
        width: 16px;
        height: 16px;
        margin-right: 0.1em;

        color: ${({ theme }) => theme.colors.gray400};
      }
      & > .card-date {
        display: block;

        color: ${({ theme }) => theme.colors.gray400};
        font-size: 0.6rem;
        font-weight: 600;
      }
    }
    & > .card-clip-icon {
      width: 20px;
      height: 20px;

      color: ${({ theme }) => theme.colors.main400};
    }
  }
`;

interface CardProps
  extends Pick<CardWithETC, 'idx' | 'name' | 'date' | 'platformIdx' | 'tags' | 'pdf'> {}

/** 2023/10/05 - Card Component - by 1-blue */
const Card: React.FC<CardProps> = ({ idx, name, date, platformIdx, tags, pdf }) => {
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
      dispatch(openCardForm({ idx }));
    }
    // 삭제
    if (type === 'delete') {
      apiDeleteCard({ idx }).then(({ message, data }) => {
        if (!data) return;

        toast.success(message);

        mutate('/card');
      });
    }
  };

  const isPast = Date.now() - new Date(date).getTime() > 0;

  return (
    <StyledCard $isPast={isPast} data-target-idx={idx}>
      <div className="card-top-container">
        <div className="card-top-wrapper">
          <input type="checkbox" className="card-checkbox" />
          <span className="card-name">{name}</span>
        </div>
        <IoEllipsisVerticalSharp
          role="button"
          className="card-option-button"
          onClick={onOpenDialog}
        />
      </div>
      <button type="button" className="card-platform" data-platform={platformIdx}>
        {platformIdx}
      </button>
      <ul className="card-tag-container">
        {tags.map(({ tag }) => (
          <li key={tag} className="card-tag" role="button" data-tag={tag}>
            {tag}
          </li>
        ))}
      </ul>
      <div className="card-bottom-container">
        <div className="card-bottom-wrapper">
          <IoTimeOutline className="card-clock-icon" />
          <time className="card-date">{dateFormat(date, 'YYYY.MM.DD')}</time>
          <time className="card-date">{dateFormat(date, 'hh:mm:ss')}</time>
          <time className="card-date">
            ( {isPast ? `-${pastTimeFormat(date)}` : `+${futureTimeFormat(date)}`} )
          </time>
        </div>

        {pdf && <IoAttach className="card-clip-icon" />}
      </div>
      {isShowDialog && (
        <div onClick={onOpenDialogByBubbling} style={{ margin: 0 }}>
          <CardDialog onClose={onCloseDialog} pdfURL={pdf} />
        </div>
      )}
    </StyledCard>
  );
};

export default Card;
