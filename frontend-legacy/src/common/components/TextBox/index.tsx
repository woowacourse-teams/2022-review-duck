import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

const propThemeType = ['default', 'underline'] as const;
const propSizeType = ['small', 'medium', 'large'] as const;

interface TextBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  theme?: typeof propThemeType[number];
  size?: typeof propSizeType[number];
}

function TextBox(
  { theme = 'default', className, size = 'medium', ...rest }: TextBoxProps,
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

export default React.forwardRef<HTMLInputElement, TextBoxProps>(TextBox);
