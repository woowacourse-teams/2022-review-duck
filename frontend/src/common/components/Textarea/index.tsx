import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

const propSizeType = ['small', 'medium', 'large'] as const;

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  className?: string;
  size?: typeof propSizeType[number];
}

function Textarea(
  { className, size = 'medium', ...rest }: Props,
  ref?: React.ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <textarea
      ref={ref}
      rows={1}
      spellCheck={false}
      className={cn(className, styles.textarea, styles[`size-${size}`])}
      {...rest}
    />
  );
}

export default React.forwardRef<HTMLTextAreaElement, Props>(Textarea);
