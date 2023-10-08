import styled from 'styled-components';
import { IoAdd } from 'react-icons/io5';

import { useAppDispatch } from '@/store';
import { openCreateCardForm } from '@/store/slices/card';

const StyledCardCreateButton = styled.button`
  width: 240px;
  padding: 0.4em;
  margin: 0.6em 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  border-radius: 0.4em;
  background-color: ${({ theme }) => theme.colors.gray300};

  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }

  & .card-create-button-icon {
    width: 36px;
    height: 36px;

    color: #fff;
  }
`;

interface CardCreateButton {
  category: string;
}

/** 2023/10/08 - 카드 생성 버튼 컴포넌트 - by 1-blue */
const CardCreateButton: React.FC<CardCreateButton> = ({ category }) => {
  const dispatch = useAppDispatch();

  const onOpenCreateCardForm = () => {
    dispatch(openCreateCardForm({ defaultCategory: category }));
  };

  return (
    <StyledCardCreateButton type="button" onClick={onOpenCreateCardForm}>
      <IoAdd className="card-create-button-icon" />
    </StyledCardCreateButton>
  );
};

export default CardCreateButton;
