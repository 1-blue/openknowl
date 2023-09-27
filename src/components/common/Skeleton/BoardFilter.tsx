import styled from 'styled-components';

import Square from './Square';

const StyledBoardFilter = styled.div`
  display: flex;
  margin-bottom: 1em;

  & > * + * {
    margin-left: 1em;
  }

  & .board-filter-skeleton-list {
    display: flex;
    flex-flow: column nowrap;

    & > * + * {
      margin-top: 0.4em;
    }
  }
`;

/** 2023/09/27 - Board Filter Skeleton Component - by 1-blue */
const BoardFilter: React.FC = () => {
  return (
    <StyledBoardFilter>
      <div className="board-filter-skeleton-list">
        <Square width="60px" height="20px" />
        <Square width="120px" height="40px" />
      </div>
      <div className="board-filter-skeleton-list">
        <Square width="60px" height="20px" />
        <Square width="320px" height="40px" />
      </div>
    </StyledBoardFilter>
  );
};

export default BoardFilter;
