import { IoCreate } from 'react-icons/io5';
import styled from 'styled-components';

const StyledBoardHeader = styled.div`
  & .board-header {
    display: flex;
    align-items: center;

    margin-bottom: 1em;
  }
  & #board-header-checkbox {
    width: 20px;
    height: 20px;
  }
  & .board-header-checkbox-label {
    padding: 0.4em 0.6em;

    letter-spacing: 1.5px;

    border-radius: 1em;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: bold;

    background-color: ${({ theme }) => theme.colors.main300};
  }
  & .card-create-button {
    width: 20px;
    height: 20px;
    margin-left: auto;
    padding: 0.1em;

    font-weight: 700;
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray500};

    transition: all 0.4s;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.main600};
    }

    & path {
      pointer-events: none;
    }
  }
`;

interface BoardHeaderProps {
  category: string;
}

/** 2023/10/06 - Board Header Component - by 1-blue */
const BoardHeader: React.FC<BoardHeaderProps> = ({ category }) => {
  return (
    <StyledBoardHeader>
      <form className="board-header">
        <input type="checkbox" id="board-header-checkbox" />
        <label htmlFor="board-header-checkbox" className="board-header-checkbox-label">
          {category}
        </label>

        <IoCreate role="button" className="card-create-button" data-category={category} />
      </form>
    </StyledBoardHeader>
  );
};

export default BoardHeader;
