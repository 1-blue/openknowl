import Link from 'next/link';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeBoardDetail } from '@/store/slices/board';

import useFetchBoard from '@/hooks/useFetchBoard';
import useOuterClick from '@/hooks/useOuterClick';

import { getPDFName } from '@/utils/board';
import { futureTimeFormat, pastTimeFormat } from '@/utils/time';

import Custom500 from '@/pages/500';

const StyledBoardDetail = styled.ul`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  padding: 1.2em 1.2em;

  & > * + * {
    margin-top: 1em;
  }

  & .board-detail-title {
    padding: 1em 1.6em;
    text-align: center;

    border-radius: 0.4em;
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: bold;
    background-color: ${({ theme }) => theme.colors.main500};
    color: #fff;
  }

  & .board-detail-list {
    display: flex;

    & > * + * {
      margin-left: 0.6em;
    }
  }

  & .board-detail-list-left,
  .board-detail-list-right {
    display: inline-block;
    padding: 0.6em;
  }
  & .board-detail-list-left {
    width: 80px;

    color: ${({ theme }) => theme.colors.blue500};
    background-color: ${({ theme }) => theme.colors.blue100};
    border-radius: 0.2em;
  }
  & .board-detail-list-right {
    flex: 1;
    color: ${({ theme }) => theme.colors.gray500};
    background-color: ${({ theme }) => theme.colors.gray200};
    border-radius: 0.2em;
  }
  & .board-detail-tag-container {
    display: flex;
    flex-flow: row wrap;
    gap: 0.4em 0.8em;
  }
  & .board-detail-tag {
    padding: 0.3em 0.5em;
    border-radius: 0.3em;
    border: 1.5px solid ${({ theme }) => theme.colors.gray400};
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray500};
  }

  & .board-pdf-function-button-container {
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

  & .board-detail-close-button {
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

/** 2023/09/25 - Board Detail Component - by 1-blue */
const BoardDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { targetIdx } = useAppSelector(state => state.board);
  const { board, isLoading, error } = useFetchBoard({ idx: targetIdx });

  /** 2023/09/25 - PDF 다운로드 - by 1-blue */
  const handlePDFDownload = async () => {
    if (!board?.pdf) return;

    const response = await fetch(board.pdf);
    const file = await response.blob();

    const downloadUrl = window.URL.createObjectURL(file); // 해당 file을 가리키는 url 생성
    const anchorElement = document.createElement('a');

    document.body.appendChild(anchorElement);
    anchorElement.download = getPDFName(board.pdf);
    anchorElement.href = downloadUrl;
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const modalRef = useOuterClick<HTMLUListElement>(() => dispatch(closeBoardDetail()));

  if (error) {
    return <Custom500 />;
  }
  // TODO:
  if (isLoading) return <></>;
  if (!board) return <></>;

  return (
    <StyledBoardDetail ref={modalRef}>
      <h6 className="board-detail-title">{board.name}</h6>
      <li className="board-detail-list">
        <span className="board-detail-list-left">이름</span>
        <span className="board-detail-list-right">{board.name}</span>
      </li>
      <li className="board-detail-list">
        <span className="board-detail-list-left">카테고리</span>
        <span className="board-detail-list-right">{board.category.category}</span>
      </li>
      <li className="board-detail-list">
        <span className="board-detail-list-left">플랫폼</span>
        <span className="board-detail-list-right">{board.platform.platform}</span>
      </li>
      <li className="board-detail-list">
        <span className="board-detail-list-left">남은 기간</span>
        <time className="board-detail-list-right">
          {Date.now() - new Date(board.date).getTime() > 0
            ? `${pastTimeFormat(board.date)}전`
            : `${futureTimeFormat(board.date)} 초과`}
        </time>
      </li>
      <li className="board-detail-list">
        <span className="board-detail-list-left">태그들</span>
        <ul className="board-detail-list-right board-detail-tag-container">
          {board.tags.map(({ tag }) => (
            <li key={tag} className="board-detail-tag">
              {tag}
            </li>
          ))}
        </ul>
      </li>
      {board.pdf && (
        <>
          <li className="board-detail-list">
            <span className="board-detail-list-left">이력서</span>
            <time className="board-detail-list-right">{getPDFName(board.pdf)}</time>
          </li>

          <div className="board-pdf-function-button-container">
            <Link href={board.pdf} target="_blank">
              PDF 보기
            </Link>
            <button type="button" onClick={handlePDFDownload}>
              PDF 다운로드
            </button>
          </div>
        </>
      )}
    </StyledBoardDetail>
  );
};

export default BoardDetail;
