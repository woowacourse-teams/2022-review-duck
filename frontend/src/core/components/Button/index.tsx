import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';

interface Props {
  type: 'button' | 'submit';
  size: 'small' | 'medium' | 'large';
  outlined: boolean;
  disabled: boolean;
  children: ReactNode;
}

function Button({ type, size, outlined, disabled, children, ...rest }: Props) {
  return (
    <button
      className={cn(styles.button, styles[size], { [styles.outlined]: outlined })}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(['submit', 'button']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  size: 'medium',
  outlined: false,
  disabled: false,
};

export default Button;
