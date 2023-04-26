import { styled } from '@linaria/react';

export interface FlexProps {
  className?: string;
  direction?: React.CSSProperties['flexDirection'];
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  gap?: 'small' | 'medium' | 'large' | 'xlarge';
}

const GAP: Record<Required<FlexProps>['gap'], `${number}rem`> = {
  small: '0.5rem',
  medium: '1rem',
  large: '2rem',
  xlarge: '3rem',
};

const FlexContainer = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify || ''};
  align-items: ${({ align }) => align || 'normal'};
  gap: ${({ gap }) => (gap ? GAP[gap] : '0')};
`;

export default FlexContainer;
