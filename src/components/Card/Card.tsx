import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';
import { IoEllipsisVerticalSharp, IoTimeOutline, IoAttach } from 'react-icons/io5';
import Link from 'next/link';

import { apiDeleteCard } from '@/apis';

import { useAppDispatch } from '@/store';
import { openUpdateCardForm } from '@/store/slices/card';

import useToggle from '@/hooks/useToggle';
import useFetchBoards from '@/hooks/useFetchBoards';

import { getPDFName } from '@/utils';
import { dateFormat, futureTimeFormat, pastTimeFormat } from '@/utils/time';

import Dialog from '@/components/common/Dialog';

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

    & > .card-name {
      margin-left: 0.2em;

      line-height: 1.3em;
      font-size: ${({ theme }) => theme.fontSize.xl};
      font-weight: bold;
    }

    & > .card-option-button {
      margin-left: auto;
      width: 28px;
      height: 28px;
      padding: 0.4em;

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
  extends Pick<CardWithETC, 'idx' | 'name' | 'date' | 'tags' | 'pdf' | 'boardIdx' | 'platform'> {}

/** 2023/10/05 - Card Component - by 1-blue */
const Card: React.FC<CardProps> = ({ idx, name, date, tags, pdf, boardIdx, platform }) => {
  const dispatch = useAppDispatch();
  const { boardsMutate } = useFetchBoards();

  const { isOpen, onClose, onOpen } = useToggle(false);

  /** 2023/09/21 - Dialog 이벤트 버블링 처리 - by 1-blue */
  const onClickButtonByBubbling: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!(e.target instanceof HTMLElement)) return;

    onClose();

    const { type } = e.target.dataset;

    // 버튼이 아니라면
    if (!(e.target instanceof HTMLButtonElement)) return;
    if (!type) return;

    // 수정
    if (type === 'update') {
      dispatch(openUpdateCardForm({ targetIdx: idx }));
    }
    // 삭제
    if (type === 'delete') {
      boardsMutate(
        boards =>
          boards && {
            ...boards,
            data: boards.data?.map(board =>
              board.idx === boardIdx
                ? { ...board, cards: board.cards.filter(card => card.idx !== idx) }
                : board,
            ),
          },
      );

      apiDeleteCard({ idx }).then(({ message }) => {
        toast.info(message);
      });
    }
  };
  /** 2023/09/25 - PDF 다운로드 - by 1-blue */
  const handlePDFDownload = async () => {
    if (!pdf) return;

    const response = await fetch(pdf);
    const file = await response.blob();

    const downloadUrl = window.URL.createObjectURL(file); // 해당 file을 가리키는 url 생성
    const anchorElement = document.createElement('a');

    document.body.appendChild(anchorElement);
    anchorElement.download = getPDFName(pdf);
    anchorElement.href = downloadUrl;
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(downloadUrl);

    toast.info(`"${pdf}" PDF를 다운로드 했습니다.`);
  };

  const isPast = Date.now() - new Date(date).getTime() > 0;

  return (
    <StyledCard $isPast={isPast} data-target-idx={idx}>
      <div className="card-top-container">
        <span className="card-name">{name}</span>
        <IoEllipsisVerticalSharp
          role="button"
          className="card-option-button"
          onClick={() => onOpen()}
        />
      </div>
      <button type="button" className="card-platform" data-platform={platform.platform}>
        {platform.platform}
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
      {isOpen && (
        <Dialog
          onClose={onClose}
          buttons={[
            { type: 'update', label: '수정' },
            { type: 'delete', label: '삭제' },
          ]}
          onClickButtonByBubbling={onClickButtonByBubbling}
        >
          {pdf && (
            <>
              <Link className="dialog-button" href={pdf} target="_blank">
                PDF 보기
              </Link>
              <button type="button" className="dialog-button" onClick={handlePDFDownload}>
                PDF 다운로드
              </button>
            </>
          )}
        </Dialog>
      )}
    </StyledCard>
  );
};

export default Card;
