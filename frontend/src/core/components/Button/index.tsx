import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';

interface Props {
  type: 'button' | 'submit';
  size: 'small' | 'medium' | 'large';
  filled: boolean;
  disabled: boolean;
  children: ReactNode;
}

function Button({ type, size, filled, disabled, children, ...rest }: Props) {
  return (
    <button
      className={cn(styles.button, styles[size], { [styles.filled]: filled })}
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
  filled: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

Button.defaultProps = {
  type: 'button',
  size: 'medium',
  filled: true,
  disabled: false,
};

export default Button;
