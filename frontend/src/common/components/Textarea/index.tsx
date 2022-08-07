import { useEffect, useRef } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const propSizeType = ['small', 'medium', 'large'] as const;

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  className?: string;
  size?: typeof propSizeType[number];
  autoResize?: boolean;
}

function Textarea({ className, size = 'medium', autoResize, value, ...rest }: Props) {
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

Textarea.propTypes = {
  size: PropTypes.oneOf(propSizeType),
  autoResize: PropTypes.bool,
};

Textarea.defaultProps = {
  size: 'medium',
  autoResize: true,
};

export default Textarea;
