import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

const typeProps = ['default', 'underline'] as const;
const sizeProps = ['small', 'medium', 'large'] as const;

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  theme?: typeof typeProps[number];
  size?: typeof sizeProps[number];
}

function TextBox(
  { theme = 'default', className, size = 'medium', ...rest }: Props,
  ref?: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      type="text"
      ref={ref}
      className={cn(className, styles.textBox, styles[`theme-${theme}`], styles[`size-${size}`])}
      {...rest}
    />
  );
}

export default React.forwardRef<HTMLInputElement, Props>(TextBox);
