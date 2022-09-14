import { useNavigate, useSearchParams } from 'react-router-dom';

import cn from 'classnames';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';

/**
 * @author 돔하디 <zuzudnf@gmail.com>
 * @comment 범용적으로 사용될 수 있는 페이지네이션 네비게이터 컴포넌트입니다.
 *          처음으로, 이전으로, 다음으로, 마지막으로 갈 수 있으며 한 페이지에서
 *          몇 개의 아이템을 보여줄 지와 페이지 이동 버튼의 개수를 몇 개 단위로
 *          보여줄 지를 prop을 통해 정할 수 있습니다.
 *          페이비 버튼을 누르면 props로 받은 pathname, search를 이용해
 *          사용처의 url을 기준으로 page=3 식으로 url 뒤에 파라미터를 추가해 라우팅 합니다.
 * @param visiblePageButtonLength?: 네비게이션에 보여질 페이지 이동 버튼의 개수입니다.
 * @param itemCountInPage: 한 페이지에서 보여질 아이템의 개수를 말합니다.
 * @param totalItemCount: 페이지네이션이 적용될 리스트의 아이템 전체 개수를 의미합니다.
 * @param pathname: 페이지네이션으로 라우팅할 pathname을 말합니다.
 *                  (ex, 페이지네이션 컴포넌트를 사용하는 위치의 location.pathname)
 * @param search?: 이 컴포넌트를 사용하는 위치의 url에 search param을 말합니다.
 *                 (ex, location.search)
 */
export interface PaginationNavigatorProps {
  visiblePageButtonLength?: 5 | 10;
  itemCountInPage: number;
  totalItemCount: number;
  pathname: string;
  search?: string;
}

function PaginationNavigator({
  visiblePageButtonLength = 5,
  itemCountInPage,
  totalItemCount,
  pathname,
  search = '',
}: PaginationNavigatorProps) {
  const [param] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = Number(param.get('page')) || 1;
  const totalPageLength = Math.ceil(totalItemCount / itemCountInPage);
  const firstPageButtonValue =
    (Math.floor(currentPage / visiblePageButtonLength) -
      (currentPage % visiblePageButtonLength === 0 ? 1 : 0)) *
      visiblePageButtonLength +
    1;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPageLength;
  const isCurrentPage = (pageNumber: number) => currentPage === pageNumber;

  const getPageButtonLength = () => {
    if (
      Math.ceil(totalPageLength / visiblePageButtonLength) ===
      Math.ceil(currentPage / visiblePageButtonLength)
    ) {
      return totalPageLength % visiblePageButtonLength;
    }
    return visiblePageButtonLength;
  };

  const handleClickPageButton = (pageNumber: number) => () => {
    const urlParams = new URLSearchParams(search);

    urlParams.set('page', `${pageNumber}`);
    navigate(pathname + '?' + urlParams.toString());
    window.scrollTo(0, 0);
  };

  return (
    <FlexContainer className={styles.container} direction="row" justify="center">
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
          onClick={handleClickPageButton(currentPage - 1)}
          disabled={isFirstPage}
        >
          이전
        </button>
        {new Array(getPageButtonLength()).fill(0).map((_, index) => (
          <button
            key={index}
            className={cn(styles.pageButton, {
              [styles.currentPage]: isCurrentPage(firstPageButtonValue + index),
            })}
            onClick={handleClickPageButton(firstPageButtonValue + index)}
            disabled={isCurrentPage(firstPageButtonValue + index)}
          >
            {firstPageButtonValue + index}
          </button>
        ))}
        <button
          className={cn(styles.pageButton, { [styles.disabled]: isLastPage })}
          onClick={handleClickPageButton(currentPage + 1)}
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

export default PaginationNavigator;
