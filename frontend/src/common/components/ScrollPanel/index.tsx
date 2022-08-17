import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';

import useDebounce from 'common/hooks/useDebounce';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';
import Icon from '../Icon';

interface Props {
  className?: string;
  centerDisabled?: boolean;
  children: React.ReactNode;
}

type controlDirection = 'previous' | 'next';
interface controlVisible {
  previous: boolean;
  next: boolean;
}

function ScrollPanel({ className, centerDisabled, children }: Props) {
  const [controlHidden, setControlVisible] = useState<controlVisible>({
    previous: true,
    next: false,
  });

  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const childElementWidth = useRef<number>(0);

  useEffect(() => {
    const $firstChildElement = listRef.current?.querySelector('*:first-child');

    if (!$firstChildElement) return;
    childElementWidth.current = $firstChildElement.clientWidth;
  }, []);

  const handleChangeScroll = useDebounce(({ target }: React.UIEvent<HTMLDivElement>) => {
    const { scrollWidth, scrollLeft, clientWidth } = target as HTMLDivElement;
    const updateControlHidden = { ...controlHidden };

    const isScrollFirstPosition = scrollLeft <= 0;
    const isScrollEndPosition = scrollWidth - clientWidth <= scrollLeft;

    updateControlHidden.previous = isScrollFirstPosition;
    updateControlHidden.next = isScrollEndPosition;

    setControlVisible(updateControlHidden);
  }, 100);

  const handleClickControlButton = (direction: controlDirection) => () => {
    if (!scrollPanelRef.current) return;

    const { scrollWidth, scrollLeft, clientWidth } = scrollPanelRef.current;

    const scrollLocation =
      direction === 'previous'
        ? scrollLeft - childElementWidth.current
        : scrollLeft + childElementWidth.current;

    const isMoveable = scrollWidth - clientWidth + childElementWidth.current >= scrollLocation;

    if (!isMoveable) return;

    scrollPanelRef.current.scrollTo(scrollLocation, 0);
  };

  return (
    <div className={styles.container}>
      <FlexContainer
        className={cn(styles.hoverDetection, styles.previous, {
          [styles.hidden]: controlHidden.previous,
        })}
        justify="center"
        align="center"
      >
        <div className={styles.controlButton} onClick={handleClickControlButton('previous')}>
          <Icon code="arrow_back_ios" />
        </div>
      </FlexContainer>

      <div
        className={cn(styles.scrollContainer, className)}
        ref={scrollPanelRef}
        onScroll={handleChangeScroll}
      >
        <div
          className={cn(styles.correctScreen, { [styles.disabled]: centerDisabled })}
          ref={listRef}
        >
          {children}
        </div>
      </div>

      <FlexContainer
        className={cn(styles.hoverDetection, styles.next, {
          [styles.hidden]: controlHidden.next,
        })}
        justify="center"
        align="center"
      >
        <div className={styles.controlButton} onClick={handleClickControlButton('next')}>
          <Icon code="arrow_forward_ios" />
        </div>
      </FlexContainer>
    </div>
  );
}

export default ScrollPanel;
