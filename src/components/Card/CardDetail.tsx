import Link from 'next/link';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeCardDetail } from '@/store/slices/card';

import useFetchCard from '@/hooks/useFetchCard';
import useOuterClick from '@/hooks/useOuterClick';

import { getPDFName } from '@/utils/board';
import { futureTimeFormat, pastTimeFormat } from '@/utils/time';

import Skeleton from '@/components/common/Skeleton';
import Overlay from '@/components/common/Overlay';
import Custom500 from '@/pages/500';

const StyledCardDetail = styled.ul`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  padding: 1.2em 1.2em;

  & > * + * {
    margin-top: 1em;
  }

  & .card-detail-title {
    padding: 1em 1.6em;
    text-align: center;

    border-radius: 0.4em;
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: bold;
    background-color: ${({ theme }) => theme.colors.main500};
    color: #fff;
  }

  & .card-detail-list {
    display: flex;

    & > * + * {
      margin-left: 0.6em;
    }
  }

  & .card-detail-list-left,
  .card-detail-list-right {
    display: inline-block;
    padding: 0.6em;
  }
  & .card-detail-list-left {
    width: 80px;

    color: ${({ theme }) => theme.colors.blue500};
    background-color: ${({ theme }) => theme.colors.blue100};
    border-radius: 0.2em;
  }
  & .card-detail-list-right {
    flex: 1;
    color: ${({ theme }) => theme.colors.gray500};
    background-color: ${({ theme }) => theme.colors.gray200};
    border-radius: 0.2em;
  }
  & .card-detail-tag-container {
    display: flex;
    flex-flow: row wrap;
    gap: 0.4em 0.8em;
  }
  & .card-detail-tag {
    padding: 0.3em 0.5em;
    border-radius: 0.3em;
    border: 1.5px solid ${({ theme }) => theme.colors.gray400};
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray500};
  }

  & .card-pdf-function-button-container {
    text-align: right;
    margin-top: 0.1em;

    & > * {
      color: ${({ theme }) => theme.colors.gray500};
      font-size: ${({ theme }) => theme.fontSize.xs};

      &:hover {
        color: ${({ theme }) => theme.colors.gray600};
        text-decoration: underline;
        text-underline-offset: 4px;
      }
    }
  }

  & .card-detail-close-button {
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
`;

/** 2023/09/25 - Card Detail Component - by 1-blue */
const CardDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { targetIdx } = useAppSelector(state => state.card);
  const { card, isLoading, error } = useFetchCard({ idx: targetIdx });

  /** 2023/09/25 - PDF 다운로드 - by 1-blue */
  const handlePDFDownload = async () => {
    if (!card?.pdf) return;

    const response = await fetch(card.pdf);
    const file = await response.blob();

    const downloadUrl = window.URL.createObjectURL(file); // 해당 file을 가리키는 url 생성
    const anchorElement = document.createElement('a');

    document.body.appendChild(anchorElement);
    anchorElement.download = getPDFName(card.pdf);
    anchorElement.href = downloadUrl;
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const modalRef = useOuterClick<HTMLUListElement>(() => dispatch(closeCardDetail()));

  if (error) {
    return <Custom500 />;
  }
  if (isLoading) {
    return (
      <Overlay>
        <Skeleton.BoardDetail />
      </Overlay>
    );
  }
  if (!card) return <></>;

  return (
    <StyledCardDetail ref={modalRef}>
      <h6 className="card-detail-title">{card.name}</h6>
      <li className="card-detail-list">
        <span className="card-detail-list-left">이름</span>
        <span className="card-detail-list-right">{card.name}</span>
      </li>
      <li className="card-detail-list">
        <span className="card-detail-list-left">카테고리</span>
        {/* TODO: */}
        {/* <span className="card-detail-list-right">{card.category.category}</span> */}
      </li>
      <li className="card-detail-list">
        <span className="card-detail-list-left">플랫폼</span>
        <span className="card-detail-list-right">{card.platform.platform}</span>
      </li>
      <li className="card-detail-list">
        <span className="card-detail-list-left">남은 기간</span>
        <time className="card-detail-list-right">
          {Date.now() - new Date(card.date).getTime() > 0
            ? `${pastTimeFormat(card.date)} 지남`
            : `${futureTimeFormat(card.date)} 전`}
        </time>
      </li>
      <li className="card-detail-list">
        <span className="card-detail-list-left">태그들</span>
        <ul className="card-detail-list-right card-detail-tag-container">
          {card.tags.map(({ tag }) => (
            <li key={tag} className="card-detail-tag">
              {tag}
            </li>
          ))}
        </ul>
      </li>
      {card.pdf && (
        <>
          <li className="card-detail-list">
            <span className="card-detail-list-left">이력서</span>
            <time className="card-detail-list-right">{getPDFName(card.pdf)}</time>
          </li>

          <div className="card-pdf-function-button-container">
            <Link href={card.pdf} target="_blank">
              PDF 보기
            </Link>
            <button type="button" onClick={handlePDFDownload}>
              PDF 다운로드
            </button>
          </div>
        </>
      )}
    </StyledCardDetail>
  );
};

export default CardDetail;
