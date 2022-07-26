import React, { useEffect, useRef, useState } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

import Text from '../Text';

const setAnimationEnd = (target: HTMLElement | undefined, handler: () => void) => {
  if (!target) return;

  target.addEventListener('animationend', handler, { once: true });
};

function Animation({ children }: Record<'children', JSX.Element | false>) {
  // 현재 컴포넌트 상태를 나타냄
  const [displayState, setDisplayState] = useState<'appear' | 'disappear' | 'change' | ''>(
    'appear',
  );

  // 마운트, 언마운트 체크용
  const isMounted = React.Children.count(children) > 0;

  // 자식 컴포넌트를 사용하지 않고, 복제함.
  const previousComponent = useRef<JSX.Element>();
  const currentComponent = useRef<HTMLElement>();

  const { key = '', props = [], type: TargetComponent = Text } = children || {};

  const classNames: [] = props?.className || [];

  const duplicatedChildren = (
    <TargetComponent
      {...props}
      className={cn(classNames, styles.container, styles[displayState])}
      key={key}
      ref={currentComponent}
    />
  );

  const onAnimationEnd = () => {
    setDisplayState('');
  };

  // 마운트, 언마운트 감지용
  useEffect(() => {
    setDisplayState(isMounted ? 'appear' : 'disappear');

    setAnimationEnd(currentComponent.current, onAnimationEnd);
  }, [isMounted]);

  // 컴포넌트 변화 감지용
  const changeDetection = [TargetComponent, key, ...props];

  useEffect(() => {
    if (children) {
      previousComponent.current = children;
    }

    if (displayState === '') {
      setDisplayState('change');
      setAnimationEnd(currentComponent.current, onAnimationEnd);
    }
  }, changeDetection);

  if (displayState === 'disappear' && previousComponent.current) {
    return previousComponent.current;
  }

  return duplicatedChildren;
}

export default Animation;
