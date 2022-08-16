import React from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const propSizeType = [12, 14, 16, 18, 20, 24, 32, 40, 48] as const;

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  element: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: typeof propSizeType[number];
  weight: 'lighter' | 'normal' | 'bold' | undefined;
  children: React.ReactNode;
}

function Text(props: TextProps) {
  const { className, element, size, weight, children, ...rest } = props;
  const classNames = cn(className, styles.text, styles[`size-${size}`], styles[`weight-${weight}`]);

  return React.createElement(element, { className: classNames, ...rest }, children);
}

Text.propTypes = {
  size: PropTypes.oneOf(propSizeType),
};

Text.defaultProps = {
  element: 'p',
  size: 14,
  weight: '',
};

export default Text;
