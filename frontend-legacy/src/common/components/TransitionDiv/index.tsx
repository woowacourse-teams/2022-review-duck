import React, { useRef, useState, useLayoutEffect } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

type DisplayState = 'appear' | 'disappear' | 'hidden' | 'visible';
type EffectType = 'fade' | 'drop' | 'unset';

interface TransitionDivProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationEnd'> {
  appear?: EffectType;
  disappear?: EffectType;
  all?: EffectType;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  visible?: boolean;
  children: React.ReactNode;
  onAppear?: React.AnimationEventHandler<HTMLDivElement>;
  onDisappear?: React.AnimationEventHandler<HTMLDivElement>;
}

function TransitionDiv({
  className,
  appear = 'unset',
  disappear = 'unset',
  all,
  duration = 500,
  direction = 'down',
  visible = true,
  children,
  onAppear,
  onDisappear,
  ...args
}: TransitionDivProps) {
  const duplicatedChildren = useRef<JSX.Element>();
  const [displayState, setDisplayState] = useState<DisplayState>(visible ? 'visible' : 'hidden');

  useLayoutEffect(
    function checkDisplayStatus() {
      const isConditionAppear = visible;
      const isConditionDisappear = displayState === 'visible' && !visible;

      if (!isConditionAppear && !isConditionDisappear) return;

      setDisplayState(visible ? 'appear' : 'disappear');
    },
    [visible],
  );

  const isUnmounted = visible === false && displayState === 'hidden';

  if (isUnmounted) {
    return <></>;
  }

  if (displayState === 'visible' && children) {
    duplicatedChildren.current = React.cloneElement(<>{children}</>);
  }

  const handleUpdateDisplayState = (event: React.AnimationEvent<HTMLDivElement>) => {
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

  const currentEffect = all || (visible ? appear : disappear);
  const animationDuration = `${(duration / 1000).toFixed(2)}s`;
  const isEffectActivated = displayState === 'appear' || displayState === 'disappear';

  return (
    <div
      className={cn(className, styles[direction], styles[displayState], {
        [styles[currentEffect]]: isEffectActivated,
      })}
      onAnimationEnd={handleUpdateDisplayState}
      style={{ animationDuration }}
      {...args}
    >
      {displayState === 'disappear' ? duplicatedChildren.current : children}
    </div>
  );
}

export default TransitionDiv;
