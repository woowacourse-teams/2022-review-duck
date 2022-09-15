import { useMemo } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';

export interface PaginationBarProps {
  visiblePageButtonLength: 5 | 10;
  itemCountInPage: number;
  totalItemCount: number;
  focusedPage: number;
  onClickPageButton: (pageNumber: number) => void;
}

function PaginationBar({
  visiblePageButtonLength,
  itemCountInPage,
  totalItemCount,
  focusedPage,
  onClickPageButton,
}: PaginationBarProps) {
  const totalPageLength = Math.ceil(totalItemCount / itemCountInPage);

  const isFirstPage = focusedPage === 1;
  const isLastPage = focusedPage === totalPageLength;
  const isCurrentPage = (pageNumber: number) => focusedPage === pageNumber;

  const currentPageNumbers: number[] = useMemo(() => {
    const totalPageStack = Math.ceil(totalPageLength / visiblePageButtonLength);
    const currentPageStack = Math.ceil(focusedPage / visiblePageButtonLength);

    const lastPageNumber =
      totalPageStack === currentPageStack
        ? totalPageLength % visiblePageButtonLength
        : visiblePageButtonLength;

    const firstPageNumber =
      (Math.floor(focusedPage / visiblePageButtonLength) -
        (focusedPage % visiblePageButtonLength === 0 ? 1 : 0)) *
        visiblePageButtonLength +
      1;

    return Array.from(
      {
        length: lastPageNumber,
      },
      (_, index) => index + firstPageNumber,
    );
  }, [totalPageLength, visiblePageButtonLength, focusedPage]);

  const handleClickPageButton = (pageNumber: number) => () => {
    onClickPageButton(pageNumber);
  };

  return (
    <FlexContainer className={styles.componentPaginationBar} direction="row" justify="center">
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
              [styles.currentPage]: isCurrentPage(pageNumber),
            })}
            onClick={handleClickPageButton(pageNumber)}
            disabled={isCurrentPage(pageNumber)}
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

PaginationBar.defaultProps = {
  visiblePageButtonLength: 5,
  focusedPage: 1,
};

export default PaginationBar;
