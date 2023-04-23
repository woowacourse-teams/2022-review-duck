// 사용 금지 -> 점진적으로 F/O & ButtonV2 대체

import { useState } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  theme?: 'default' | 'outlined' | 'circle';
  filled?: boolean;
  children: React.ReactNode;
}

function Button({
  className,
  size = 'medium',
  theme = 'default',
  filled = false,
  onClick,
  children,
  ...rest
}: ButtonProps) {
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

export default Button;
