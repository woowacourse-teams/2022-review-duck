import React, { useRef, useState, useLayoutEffect } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

type DisplayState = 'appear' | 'disappear' | 'hidden' | 'visible';
type EffectType = 'fade' | 'drop';

interface Props {
  duration: number;
  all?: EffectType;
  appear?: EffectType;
  disappear?: EffectType;
  children: JSX.Element | false;
}

function Effect(props: Props) {
  const { duration, children } = props;

  const duplicatedComponent = useRef<JSX.Element>();
  const [displayState, setDisplayState] = useState<DisplayState>('visible');

  const isMounted = !!children;

  if (isMounted) {
    duplicatedComponent.current = children;
  }

  useLayoutEffect(() => {
    setDisplayState(isMounted ? 'appear' : 'disappear');
  }, [isMounted]);

  const onAnimationEnd = () => {
    setDisplayState(displayState === 'disappear' ? 'hidden' : 'visible');
  };

  switch (displayState) {
    case 'visible':
    case 'hidden':
      return <>{children}</>;

    default: {
      const isUnmounted = displayState === 'disappear';
      const currentEffect = props[displayState] || props.all || 'unset';
      const animationDuration =
        currentEffect !== 'unset' ? `${(duration / 1000).toFixed(2)}s` : '0s';

      return (
        <div
          className={cn(
            styles.eventContainer,
            styles[`effect-${currentEffect}`],
            styles[`on-${displayState}`],
          )}
          onAnimationEnd={onAnimationEnd}
          style={{ animationDuration }}
        >
          {isUnmounted ? duplicatedComponent.current : children}
        </div>
      );
    }
  }
}

Effect.propTypes = {
  duration: PropTypes.number,
};

Effect.defaultProps = {
  duration: 1000,
};

export default Effect;
