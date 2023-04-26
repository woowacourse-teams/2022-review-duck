import { styled } from '@linaria/react';

export interface TextProps {
  size?: 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 40 | 48;
  weight?: React.CSSProperties['fontWeight'];
}

const SIZE: Record<Required<TextProps>['size'], `${number}rem`> = {
  '12': '0.75rem',
  '14': '0.875rem',
  '16': '1rem',
  '18': '1.125rem',
  '20': '1.25rem',
  '24': '1.5rem',
  '28': '1.75rem',
  '32': '2rem',
  '40': '2.5rem',
  '48': '3rem',
};

const Text = styled.p<TextProps>`
  font-size: ${({ size }) => SIZE[size || '16']};
  font-weight: ${({ weight }) => weight || 'normal'};
  word-break: break-word;

  h1&,
  h2&,
  h3&,
  h4&,
  h5&,
  h6& {
    font-weight: bold;
  }

  h1& {
    font-size: 2.25rem;
  }

  h2& {
    font-size: 2rem;
  }

  h3& {
    font-size: 1.75rem;
  }

  h4& {
    font-size: 1.5rem;
  }

  h5& {
    font-size: 1.25rem;
  }

  h6& {
    font-size: 1rem;
  }
`;

export default Text;
