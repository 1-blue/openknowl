import styled from 'styled-components';
import Select from 'react-select';
import type { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';
import type { SelectOption } from '@/types';

const StyledComboboxWrapper = styled.fieldset`
  position: relative;
  display: flex;
  flex-flow: column nowrap;

  & > * + * {
    margin-top: 0.2em;
  }

  & .combobox-label {
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray600};

    cursor: pointer;
  }
  & .combobox-label-required {
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.red500};
  }
`;

const StyledCombobox = styled(Select).attrs({
  classNamePrefix: 'react-select',
})`
  // selected
  .react-select__control {
    background-color: transparent;
    border: 1.5px solid ${({ theme }) => theme.colors.gray600};
    box-shadow: 0;

    &:hover {
      border: 1.5px solid ${({ theme }) => theme.colors.main500};
    }
  }
  // selected
  .react-select__single-value {
    color: #000;
    font-weight: 500;
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
  .react-select__control--is-focused {
    border: 1.5px solid ${({ theme }) => theme.colors.main500};
  }
  // |
  .react-select__indicator-separator {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
  // 아래 화살표
  .react-select__indicator {
    color: ${({ theme }) => theme.colors.gray700};
  }
  // menu
  .react-select__menu {
  }
  // option
  .react-select__option {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray600};
  }
  // select
  .react-select__option--is-selected {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.main400};
  }
  // hover
  .react-select__option--is-focused {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.main300};
  }
  // active
  .react-select__option--is-actived {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.main500};
  }
  // placeholder
  .react-select__placeholder {
    color: white;
    font-weight: 600;
  }
  //
  .react-select__multi-value {
    padding: 0.1em;

    color: #fff;
    background-color: ${({ theme }) => theme.colors.main400};
  }
  // multi 선택
  .react-select__multi-value__label {
    color: #fff;
  }
  // multi 선택 제거
  .react-select__multi-value__remove {
    &:hover {
      background-color: ${({ theme }) => theme.colors.main500};
      color: #fff;
    }
  }
  .react-select__placeholder {
    color: ${({ theme }) => theme.colors.gray400};
    font-size: ${({ theme }) => theme.fontSize.xs};
  }
`;

interface ComboboxProps extends StateManagerProps<SelectOption> {
  id: string;
  required?: boolean;
  options: SelectOption[];
}

/** 2023/09/21 - Combobox Component - by 1-blue */
const Combobox: React.FC<ComboboxProps> = ({ id, required, options, ...props }) => {
  return (
    <StyledComboboxWrapper>
      <label htmlFor={id}>
        <span className="combobox-label">{id}</span>
        {required && <span className="combobox-label-required"> ( 필수 )</span>}
      </label>
      <StyledCombobox options={options} {...props} />
    </StyledComboboxWrapper>
  );
};

export default Combobox;
