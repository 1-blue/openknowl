import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.fieldset`
  position: relative;
  display: flex;
  flex-flow: column nowrap;

  & > * + * {
    margin-top: 0.2em;
  }

  & .input-label {
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray600};

    cursor: pointer;
  }
  & .input-label-required {
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.red500};
  }
  & .input,
  .input-replacement {
    padding: 0.4em 0.8em;

    border: 0;
    border: 1.5px solid ${({ theme }) => theme.colors.gray600};
    border-radius: 0.3em;
    font-size: 1rem;

    transition: all 0.4s;

    &:focus {
      outline: none;
      border: 1.5px solid ${({ theme }) => theme.colors.main600};
    }
    &::placeholder {
      font-size: ${({ theme }) => theme.fontSize.sm};
    }
  }

  & .input-info,
  .input-warning,
  .input-error {
    padding-top: 0.4em;
    font-size: ${({ theme }) => theme.fontSize.xs};
  }
  & .input-info {
    color: ${({ theme }) => theme.colors.blue500};
  }
  & .input-warning {
    color: ${({ theme }) => theme.colors.yellow500};
  }
  & .input-error {
    color: ${({ theme }) => theme.colors.red500};
  }

  & .input-replacement {
    height: 120px;

    font-size: 1rem;
  }
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /** label의 이름 */
  id: string;
  /** 정보 메시지 */
  info?: string;
  /** 경고 메시지 */
  warning?: string;
  /** 에러 메시지 */
  error?: string;
  /** 라벨 숨기기 */
  labelHidden?: boolean;
}

/** 2023/09/21 - "react-hook-form" 전용 input 컴포넌트 - by 1-blue */
const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ id, info, warning, error, required, labelHidden, ...props }, ref) => {
    return (
      <StyledInput>
        <label htmlFor={id}>
          <span className="input-label">{id}</span>
          {required && <span className="input-label-required"> ( 필수 )</span>}
        </label>
        <input id={id} className="input" ref={ref} {...props} />
        {info && <span className="input-info">** {info} **</span>}
        {warning && <span className="input-warning">** {warning} **</span>}
        {error && <span className="input-error">** {error} **</span>}
      </StyledInput>
    );
  },
);

export default Input;
