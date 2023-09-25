import styled from 'styled-components';

import Square from './Square';

const StyledBoardDetail = styled.div`
  padding: 2em;

  background-color: white;
  border-radius: 0.4em;

  & .board-detail-skeleton-container {
    margin-top: 1em;

    & > * + * {
      margin-top: 1em;
    }
  }
  & .board-detail-skeleton-wrapper {
    display: flex;

    & > * + * {
      margin-left: 1em;
    }
  }
`;

/** 2023/09/25 - Board Detail Skeleton Component - by 1-blue */
const BoardDetail: React.FC = () => {
  return (
    <StyledBoardDetail>
      <Square width="100%" height="80px" />

      <ul className="board-detail-skeleton-container">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <li key={i} className="board-detail-skeleton-wrapper">
              <Square width="80px" height="40px" />
              <Square width="300px" height="40px" />
            </li>
          ))}
      </ul>
    </StyledBoardDetail>
  );
};

export default BoardDetail;
