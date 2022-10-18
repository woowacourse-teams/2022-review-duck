import { useEffect, useMemo } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';

export interface PaginationBarProps extends React.HTMLAttributes<HTMLDivElement> {
  visiblePageButtonLength?: number;
  itemCountInPage: number;
  totalItemCount: number;
  focusedPage?: number;
  scrollReset?: boolean;
  onClickPageButton: (pageNumber: number) => void;
}

function PaginationBar({
  className,
  visiblePageButtonLength = 5,
  itemCountInPage,
  totalItemCount,
  focusedPage = 1,
  scrollReset = true,
  onClickPageButton,
  ...args
}: PaginationBarProps) {
  const totalPageLength = Math.ceil(totalItemCount / itemCountInPage);

  const isFirstPage = focusedPage === 1;
  const isLastPage = focusedPage === totalPageLength;

  useEffect(
    function resetPreviousScroll() {
      if (!scrollReset) return;
      window.scrollTo(0, 0);
    },
    [scrollReset, focusedPage],
  );

  const currentPageNumbers: number[] = useMemo(() => {
    const totalPageStack = Math.ceil(totalPageLength / visiblePageButtonLength);
    const currentPageStack = Math.ceil(focusedPage / visiblePageButtonLength);

    const pageButtonLength =
      totalPageStack === currentPageStack && totalPageLength % visiblePageButtonLength !== 0
        ? totalPageLength % visiblePageButtonLength
        : visiblePageButtonLength;

    const firstPageNumber =
      (Math.floor(focusedPage / visiblePageButtonLength) -
        (focusedPage % visiblePageButtonLength === 0 ? 1 : 0)) *
        visiblePageButtonLength +
      1;

    return Array.from(
      {
        length: pageButtonLength,
      },
      (_, index) => index + firstPageNumber,
    );
  }, [totalPageLength, visiblePageButtonLength, focusedPage]);

  if (totalItemCount === 0) return <></>;

  const isFocusedPage = (pageNumber: number) => focusedPage === pageNumber;

  const handleClickPageButton = (pageNumber: number) => () => {
    onClickPageButton(pageNumber);
  };

  return (
    <FlexContainer
      className={cn(className, styles.componentPaginationBar)}
      direction="row"
      justify="center"
      {...args}
    >
      <div className={styles.pageButtonContainer}>
        <button
          className={cn(styles.pageButton, { [styles.disabled]: isFirstPage })}
          onClick={handleClickPageButton(1)}
          disabled={isFirstPage}
        >
          처음으로
        </button>
        <button
          className={cn(styles.pageButton, { [styles.disabled]: isFirstPage })}
          onClick={handleClickPageButton(focusedPage - 1)}
          disabled={isFirstPage}
        >
          이전
        </button>

        {currentPageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={cn(styles.pageButton, {
              [styles.currentPage]: isFocusedPage(pageNumber),
            })}
            onClick={handleClickPageButton(pageNumber)}
            disabled={isFocusedPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className={cn(styles.pageButton, { [styles.disabled]: isLastPage })}
          onClick={handleClickPageButton(focusedPage + 1)}
          disabled={isLastPage}
        >
          다음
        </button>
        <button
          className={cn(styles.pageButton, { [styles.disabled]: isLastPage })}
          onClick={handleClickPageButton(totalPageLength)}
          disabled={isLastPage}
        >
          마지막으로
        </button>
      </div>
    </FlexContainer>
  );
}

export default PaginationBar;
