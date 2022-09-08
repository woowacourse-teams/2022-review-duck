import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  element: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 40 | 48;
  weight: 'lighter' | 'normal' | 'bold';
  children: React.ReactNode;
}

function Text(props: TextProps) {
  const { className, element, size, weight, children, ...rest } = props;
  const classNames = cn(className, styles.text, styles[`size-${size}`], styles[`weight-${weight}`]);

  return React.createElement(element, { className: classNames, ...rest }, children);
}

Text.defaultProps = {
  element: 'p',
  size: 14,
  weight: 'normal',
};

export default Text;
