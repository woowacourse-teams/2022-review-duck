import { useEffect, useRef, useState } from 'react';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import useDebounceCallback from 'common/hooks/useDebounceCallback';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';

interface ScrollPanelProps {
  className?: string;
  centerDisabled?: boolean;
  children: React.ReactNode;
}

type controlDirection = 'previous' | 'next';
interface controlVisible {
  previous: boolean;
  next: boolean;
}

function ScrollPanel({ className, centerDisabled, children }: ScrollPanelProps) {
  const [buttonVisible, setButtonVisible] = useState<controlVisible>({
    previous: true,
    next: false,
  });

  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const childElementWidth = useRef<number>(0);

  const updateButtonVisible = () => {
    if (!scrollPanelRef.current) return;

    const { scrollWidth, scrollLeft, clientWidth } = scrollPanelRef.current;

    const isPreviousButtonVisible = scrollLeft <= 0;
    const isNextButtonVisible = scrollWidth - clientWidth <= scrollLeft;

    setButtonVisible({
      ...buttonVisible,
      previous: isPreviousButtonVisible,
      next: isNextButtonVisible,
    });
  };

  useEffect(
    function scrollPositionInitial() {
      if (!scrollPanelRef.current) return;

      scrollPanelRef.current.scrollLeft = 0;
      updateButtonVisible();
    },
    [children],
  );

  useEffect(function getChildItemWidth() {
    const $firstChildElement = listRef.current?.querySelector('*:first-child');

    if (!$firstChildElement) return;
    childElementWidth.current = $firstChildElement.clientWidth;
  }, []);

  const handleUpdateScrollPosition = useDebounceCallback(() => updateButtonVisible(), 50);

  const handleChangeScroll = (direction: controlDirection) => () => {
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
    <div className={styles.componentScrollPanel}>
      <FlexContainer
        className={cn(styles.controlWrapper, styles.previous, {
          [styles.hidden]: buttonVisible.previous,
        })}
        justify="center"
        align="center"
      >
        <div className={styles.controlButton} onClick={handleChangeScroll('previous')}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      </FlexContainer>

      <div
        className={cn(styles.scrollContainer, className)}
        ref={scrollPanelRef}
        onScroll={handleUpdateScrollPosition}
      >
        <div
          className={cn(styles.correctScreen, { [styles.disabled]: centerDisabled })}
          ref={listRef}
        >
          {children}
        </div>
      </div>

      <FlexContainer
        className={cn(styles.controlWrapper, styles.next, {
          [styles.hidden]: buttonVisible.next,
        })}
        justify="center"
        align="center"
      >
        <div className={styles.controlButton} onClick={handleChangeScroll('next')}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </FlexContainer>
    </div>
  );
}

export default ScrollPanel;
