import styled from 'styled-components';
import type { CSSProperties } from 'react';

const StyledSquare = styled.div<SquareProps>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  border-radius: 0.2em;

  animation: ${({ theme }) => theme.animation.gradient} 1s infinite linear;
`;

interface SquareProps
  extends Pick<CSSProperties, 'width' | 'height'>,
    React.HTMLAttributes<HTMLDivElement> {}

/** 2023/09/22 - Skeleton Component - by 1-blue */
const Square: React.FC<SquareProps> = props => {
  return <StyledSquare {...props} />;
};

export default Square;
