import { useEffect, useRef } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  autoResize?: boolean;
}

function Textarea({ className, size = 'medium', autoResize, value, ...rest }: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;

    textareaRef.current.style.height = '0px';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={cn(className, styles.textarea, styles[`size-${size}`])}
      value={value}
      {...rest}
    />
  );
}

Textarea.defaultProps = {
  size: 'medium',
  autoResize: true,
};

export default Textarea;
