import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { IoArchiveOutline } from 'react-icons/io5';

import Overlay from '@/components/common/Overlay';

const StyledDropzone = styled.article`
  & .dropzone-container {
    padding: 160px 240px;

    border-radius: 0.6em;
    border: 5px dotted ${({ theme }) => theme.colors.main400};
  }
  & .dropzone-icon {
    width: 100px;
    height: 100px;
    color: ${({ theme }) => theme.colors.main500};
  }
`;

interface DropzoneProps {
  onDropExcute: (file: File) => void;
}

/** 2023/09/22 - Dropzone Component - by 1-blue */
const Dropzone: React.FC<React.PropsWithChildren<DropzoneProps>> = ({ onDropExcute, children }) => {
  /** 2023/09/23 - Drop 이벤트 핸들러 - by 1-blue */
  const onDrop = async (files: File[]) => {
    const file = files[0];

    onDropExcute(file);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ noClick: true, onDrop });

  return (
    <>
      <StyledDropzone {...getRootProps()}>
        <input {...getInputProps()} />

        {children}

        {isDragActive && (
          <Overlay>
            <div className="dropzone-container">
              <IoArchiveOutline className="dropzone-icon" />
            </div>
          </Overlay>
        )}
      </StyledDropzone>
    </>
  );
};

export default Dropzone;
