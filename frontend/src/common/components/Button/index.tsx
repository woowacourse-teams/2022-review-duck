import PropTypes from 'prop-types';
import React, { MouseEvent, ReactNode, useState } from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';

const themeProps = ['default', 'outlined', 'circle'] as const;

interface Props {
  type: 'button' | 'submit';
  size: 'small' | 'medium' | 'large';
  theme: typeof themeProps[number];
  disabled: boolean;
  onClick?: React.MouseEventHandler;
  children: ReactNode;
}

function Button({ type, size, theme, disabled, onClick, children, ...rest }: Props) {
  const [rippleEffect, setRippleEffect] = useState({ isRippling: false, clickX: -1, clickY: -1 });

  const handleRippleEffect = (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;

    const { clientX, clientY } = event;
    const { left, top } = target.getBoundingClientRect();

    setRippleEffect({ isRippling: true, clickX: clientX - left, clickY: clientY - top });
    onClick && onClick(event);
  };

  const onRippleEffectEnd = () => {
    setRippleEffect({ ...rippleEffect, isRippling: false });
  };

  return (
    <button
      className={cn(styles.button, styles[size], styles[`theme-${theme}`])}
      type={type}
      disabled={disabled}
      onClick={handleRippleEffect}
      {...rest}
    >
      {children}

      {rippleEffect.isRippling && (
        <div
          className={styles.rippleEffect}
          onAnimationEnd={onRippleEffectEnd}
          style={{ left: rippleEffect.clickX, top: rippleEffect.clickY }}
        ></div>
      )}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(['submit', 'button']),
  theme: PropTypes.oneOf(themeProps),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  theme: 'default',
  size: 'medium',
  disabled: false,
};

export default Button;
