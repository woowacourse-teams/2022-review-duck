import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

const propSizeType = ['small', 'medium', 'large'] as const;

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  className?: string;
  size?: typeof propSizeType[number];
}

function Textarea({ className, size = 'medium', ...rest }: Props) {
  const onResize = ({ key, target }: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (key !== 'Enter' && key !== 'Backspace') return;

    const lineCount = target.value.split('\n').length;

    target.setAttribute('rows', String(lineCount && lineCount + 1) || '2');
  };

  return (
    <textarea
      rows={2}
      spellCheck={false}
      className={cn(className, styles.textarea, styles[`size-${size}`])}
      onKeyDown={onResize}
      {...rest}
    />
  );
}

export default Textarea;
