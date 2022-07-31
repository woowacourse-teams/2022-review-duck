import { useState } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const propSizeType = ['small', 'medium', 'large'] as const;
const propThemeType = ['default', 'outlined', 'circle'] as const;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size: typeof propSizeType[number];
  theme: typeof propThemeType[number];
  filled: boolean;
  children: React.ReactNode;
}

function Button({ className, size, theme, filled, onClick, children, ...rest }: Props) {
  const [rippleEffect, setRippleEffect] = useState({ isRippling: false, clickX: -1, clickY: -1 });

  const handleRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      className={cn(className, styles.button, styles[size], styles[`theme-${theme}`], {
        [styles.filled]: filled,
      })}
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
  theme: PropTypes.oneOf(propThemeType),
  size: PropTypes.oneOf(propSizeType),
  filled: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  theme: 'default',
  size: 'medium',
  filled: false,
  disabled: false,
};

export default Button;
