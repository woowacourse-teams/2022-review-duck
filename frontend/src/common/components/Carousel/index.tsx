import { useEffect, useRef, useState } from 'react';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import styles from './styles.module.scss';

import setDebounceCallback from 'utils/setDebounceCallback';

interface CarouselProps {
  className?: string;
  centerDisabled?: boolean;
  children: React.ReactNode;
}

type controlDirection = 'previous' | 'next';
interface controlVisible {
  previous: boolean;
  next: boolean;
}

function Carousel({ className, centerDisabled, children }: CarouselProps) {
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
    const $firstChildElement = listRef.current?.firstElementChild;

    if (!$firstChildElement) return;
    childElementWidth.current = $firstChildElement.clientWidth;
  }, []);

  const handleUpdateScrollPosition = setDebounceCallback(updateButtonVisible, 50);

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
    <div className={styles.componentCarousel}>
      <button
        className={cn(styles.button, styles.previous, {
          [styles.hidden]: buttonVisible.previous,
        })}
        onClick={handleChangeScroll('previous')}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

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

      <button
        className={cn(styles.button, styles.next, {
          [styles.hidden]: buttonVisible.next,
        })}
        onClick={handleChangeScroll('next')}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}

export default Carousel;
