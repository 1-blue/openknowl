import styled from 'styled-components';
import { IoAdd } from 'react-icons/io5';

const StyledBoardCreateButton = styled.button`
  place-self: start;
  width: 240px;
  min-height: 120px;

  background-color: ${({ theme }) => theme.colors.gray300};
  border-radius: 0.4em;

  transition: all 0.4s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.main200};
  }

  & .board-create-button-icon {
    width: 36px;
    height: 36px;

    color: #fff;
  }
`;

/** 2023/10/06 - Board Create Button Component - by 1-blue */
const BoardCreateButton: React.FC = () => {
  return (
    <StyledBoardCreateButton type="button">
      <IoAdd className="board-create-button-icon" />
    </StyledBoardCreateButton>
  );
};

export default BoardCreateButton;
