import React, { useRef, useState, useLayoutEffect } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

type DisplayState = 'appear' | 'disappear' | 'hidden' | 'visible';
type EffectType = 'fade' | 'drop' | 'unset';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationEnd'> {
  appear: EffectType;
  disappear: EffectType;
  all?: EffectType;
  duration: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isVisible?: boolean;
  onAppear?: React.AnimationEventHandler<HTMLDivElement>;
  onDisappear?: React.AnimationEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

function TransitionDiv({
  className,
  appear,
  disappear,
  all,
  duration,
  direction,
  isVisible,
  onAppear,
  onDisappear,
  children,
  ...rest
}: Props) {
  const duplicatedChildren = useRef<JSX.Element>();
  const [displayState, setDisplayState] = useState<DisplayState>(isVisible ? 'visible' : 'hidden');

  useLayoutEffect(() => {
    const isConditionAppear = isVisible;
    const isConditionDisappear = displayState === 'visible' && !isVisible;

    if (!isConditionAppear && !isConditionDisappear) return;

    setDisplayState(isVisible ? 'appear' : 'disappear');
  }, [isVisible]);

  const isUnmounted = isVisible === false && displayState === 'hidden';

  if (isUnmounted) {
    return <></>;
  }

  if (displayState === 'visible' && children) {
    duplicatedChildren.current = React.cloneElement(<>{children}</>);
  }

  const onTransitionEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    const { target, currentTarget } = event;
    const isEventCapturing = target !== currentTarget;

    if (isEventCapturing) return;

    if (displayState === 'appear') {
      setDisplayState('visible');
      onAppear && onAppear(event);
    }

    if (displayState === 'disappear') {
      setDisplayState('hidden');
      onDisappear && onDisappear(event);
    }
  };

  const currentEffect = all || (isVisible ? appear : disappear);
  const animationDuration = `${(duration / 1000).toFixed(2)}s`;
  const isEffectActivated = displayState === 'appear' || displayState === 'disappear';

  return (
    <div
      className={cn(className, styles[direction], styles[displayState], {
        [styles[currentEffect]]: isEffectActivated,
      })}
      onAnimationEnd={onTransitionEnd}
      style={{ animationDuration }}
      {...rest}
    >
      {displayState === 'disappear' ? duplicatedChildren.current : children}
    </div>
  );
}

TransitionDiv.defaultProps = {
  appear: 'unset',
  disappear: 'unset',
  direction: 'down',
  duration: 500,
  isVisible: true,
};

export default TransitionDiv;
