import { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const typeProps = ['default', 'underline'] as const;
const sizeProps = ['small', 'medium', 'large'] as const;

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  theme: typeof typeProps[number];
  size: typeof sizeProps[number];
}

function TextBox({ theme, className, size, ...rest }: Props) {
  return (
    <input
      type="text"
      className={cn(className, styles.textBox, styles[`theme-${theme}`], styles[`size-${size}`])}
      {...rest}
    />
  );
}

TextBox.propTypes = {
  theme: PropTypes.oneOf(typeProps),
  size: PropTypes.oneOf(sizeProps),
};

TextBox.defaultProps = {
  theme: 'default',
  size: 'medium',
};

export default TextBox;
