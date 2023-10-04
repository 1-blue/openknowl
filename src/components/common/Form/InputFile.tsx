import React, { useRef } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';

const StyledInputFile = styled.fieldset`
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
    &:hover {
      border-color: ${({ theme }) => theme.colors.main500};

      & .dropzone-icon {
        color: ${({ theme }) => theme.colors.main400};
      }
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
    text-align: left;
    font-size: 1rem;

    cursor: pointer;

    &::placeholder {
      font-size: ${({ theme }) => theme.fontSize.xs};
    }
  }

  & .file-delete-container {
    display: flex;
    align-items: center;

    cursor: pointer;

    & .file-delete-button,
    .file-delete-text {
      color: ${({ theme }) => theme.colors.red500};
      font-size: ${({ theme }) => theme.fontSize.xs};

      transition: all 0.4s;

      &:hover {
        color: ${({ theme }) => theme.colors.red600};
      }
    }
    & .file-delete-button {
      width: 16px;
      height: 16px;
    }
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
  /** 대체 이름 */
  replacementName?: string | null;
  /** 등록한 파일 없애기 */
  resetFile: () => void;
}

/** 2023/09/25 - "react-hook-form" 전용 file input 컴포넌트 - by 1-blue */
const InputFile = React.forwardRef<HTMLInputElement, Props>(
  (
    { id, info, warning, error, required, labelHidden, replacementName, resetFile, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
      <StyledInputFile>
        <label htmlFor={id}>
          <span className="input-label">{id}</span>
          {required && <span className="input-label-required"> ( 필수 )</span>}
        </label>
        <input
          id={id}
          className="input"
          ref={e => {
            if (typeof ref === 'function') {
              ref(e);
            }
            inputRef.current = e;
          }}
          {...props}
        />
        {props.hidden && (
          <input
            type="text"
            className="input-replacement"
            onClick={() => inputRef.current?.click()}
            value={replacementName || ''}
            placeholder="PDF를 업로드하세요!"
            readOnly
          />
        )}
        {replacementName && (
          <div role="button" className="file-delete-container" onClick={resetFile}>
            <IoClose className="file-delete-button" />
            <span className="file-delete-text">PDF 제거하기</span>
          </div>
        )}
        {info && <span className="input-info">** {info} **</span>}
        {warning && <span className="input-warning">** {warning} **</span>}
        {error && <span className="input-error">** {error} **</span>}
      </StyledInputFile>
    );
  },
);

export default InputFile;
