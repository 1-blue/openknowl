import styled from 'styled-components';

import Square from './Square';
import { useEffect, useState } from 'react';

const StyledBoardGroup = styled.section`
  display: inline-flex;
  height: 100vh;

  padding: 1em 0.4em;

  & > * + * {
    margin-left: 1em;
  }

  & .skeleton-board-gruop {
    width: 240px;
    padding: 1em;

    & > * + * {
      margin-top: 1em;
    }
  }

  & .skeleton-board-group-top {
    display: flex;
    justify-content: space-between;

    & .skeleton-board-group-top-container {
      display: flex;

      & div {
        margin-right: 0.6em;
      }
    }
  }
`;

/** 2023/09/22 - Board Goup Skeleton Component - by 1-blue */
const BoardGroup: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <StyledBoardGroup>
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <Square key={i} height="100%" className="skeleton-board-gruop">
            <div className="skeleton-board-group-top">
              <div className="skeleton-board-group-top-container">
                <Square width="30px" height="30px" />
                <Square width="50px" height="30px" />
              </div>
              <Square width="80px" height="30px" />
            </div>
            {Array(Math.floor(Math.random() * 4) + 2)
              .fill(null)
              .map((_, i) => (
                <Square key={i} width="100%" height="160px" />
              ))}
          </Square>
        ))}
    </StyledBoardGroup>
  );
};

export default BoardGroup;
