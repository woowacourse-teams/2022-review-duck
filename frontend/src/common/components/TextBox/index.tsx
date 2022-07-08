import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.module.scss';
import { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

const typeProps = ['default', 'underline'] as const;
const sizeProps = ['small', 'medium', 'large'] as const;

interface Props {
  className?: string;
  theme: typeof typeProps[number];
  size: typeof sizeProps[number];
  placeholder?: string;
  value?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function TextBox({
  theme,
  className,
  size,
  placeholder,
  value,
  onFocus,
  onChange,
  onKeyUp,
  ...rest
}: Props) {
  return (
    <input
      type="text"
      className={cn(className, styles.textBox, styles[`theme-${theme}`], styles[`size-${size}`])}
      placeholder={placeholder}
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      onKeyUp={onKeyUp}
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
