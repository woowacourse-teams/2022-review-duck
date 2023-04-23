import { styled } from '@linaria/react';
import theme from 'styles/theme';

export interface DividerProps {
  borderWidth?: 'lighter' | 'normal' | 'bold';
}

const BORDER_WIDTH: Record<Required<DividerProps>['borderWidth'], `${number}px`> = {
  lighter: '1px',
  normal: '2px',
  bold: '3px',
};

const Divider = styled.hr<DividerProps>`
  width: 100%;
  border-bottom: ${({ borderWidth }) =>
    `${BORDER_WIDTH[borderWidth || 'lighter']} solid ${theme.color.deepGreen['50']}`};
  margin: 0;
`;

export default Divider;
