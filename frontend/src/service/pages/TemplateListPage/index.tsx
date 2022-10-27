import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER, PAGE_OPTION } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplates } from 'service/hooks/queries/template';
import useNavigateHandler from 'service/hooks/useNavigateHandler';

import { isNumberString } from 'common/utils/validator';
import { getElapsedTimeText, isInclude } from 'service/@shared/utils';

import { PaginationBar } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import styles from './styles.module.scss';

import Filter from './view/Filter';
import { UserAgentContext } from 'common/contexts/UserAgent';
import LayoutContainer from 'service/components/LayoutContainer';
import NoResult from 'service/components/NoResult';
import TemplateCard from 'service/components/TemplateCard';

function TemplateListPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const { navigate, handleLinkPage } = useNavigateHandler();
  const { isMobile } = useContext(UserAgentContext);

  const pageNumberParams = searchParam.get(FILTER.PAGE);
  const pageNumber =
    isNumberString(pageNumberParams) && Number(pageNumberParams) > 0 ? Number(pageNumberParams) : 1;

  const filterQueryString = searchParam.get(FILTER.SORT);
  const searchQueryString = searchParam.get(FILTER.SEARCH) || '';

  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const { data, isLoading, isError } = useGetTemplates({
    filter: currentTab,
    search: searchQueryString,
    pageNumber,
    itemCount: isMobile ? PAGE_OPTION.MOBILE_TEMPLATE_ITEM_SIZE : undefined,
  });

  if (isLoading || isError) return <>{/* Error Boundary, Suspense Used */}</>;

  const { numberOfTemplates, templates } = data;

  const handleChangeSortList = (query: TemplateFilterType) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_LIST}?${FILTER.SORT}=${query}`);
  };

  const handleClickPagination = (pageNumber: number, replace = false) => {
    if (searchQueryString) {
      setSearchParam({ search: searchQueryString, page: String(pageNumber) }, { replace });
    } else {
      setSearchParam({ sort: currentTab, page: String(pageNumber) }, { replace });
    }
  };

  const handlePageError = () => {
    const totalPageLength = Math.ceil(numberOfTemplates / PAGE_OPTION.TEMPLATE_ITEM_SIZE);
    const redirectReplace = true;

    if (pageNumber > totalPageLength || pageNumber <= 0) {
      handleClickPagination(totalPageLength, redirectReplace);
    }
  };

  return PageSuspense(
    <LayoutContainer>
      <Filter>
        {searchQueryString ? (
          <Filter.SearchResult search={searchQueryString} />
        ) : (
          <Filter.SortList
            focusedOption={currentTab}
            sortOptions={[
              { icon: faArrowTrendUp, query: FILTER.TEMPLATE_TAB.TREND, name: '트랜딩' },
              { icon: faBarsStaggered, query: FILTER.TEMPLATE_TAB.LATEST, name: '최신' },
            ]}
            onClickSortButton={handleChangeSortList}
          />
        )}

        <Filter.MoreButtons onClickCreate={handleLinkPage(PAGE_LIST.TEMPLATE_FORM)} />
      </Filter>

      {numberOfTemplates === 0 ? (
        <NoResult>템플릿이 없습니다.</NoResult>
      ) : (
        <div className={styles.templateContainer}>
          {templates.map(({ info, creator }) => (
            <TemplateCard
              key={info.id}
              className={styles.card}
              onClick={handleLinkPage(
                `${PAGE_LIST.TEMPLATE_DETAIL}/${info.id}?${FILTER.SORT}=${currentTab}`,
              )}
            >
              <TemplateCard.Tag usedCount={info.usedCount} />
              <TemplateCard.Title>{info.title}</TemplateCard.Title>
              <TemplateCard.UpdatedAt>{getElapsedTimeText(info.updatedAt)}</TemplateCard.UpdatedAt>
              <TemplateCard.Description>{info.description}</TemplateCard.Description>

              <TemplateCard.Profile
                profileUrl={creator.profileUrl}
                nickname={creator.nickname}
                socialNickname={creator.socialNickname}
              />
            </TemplateCard>
          ))}

          <PaginationBar
            className={styles.pagination}
            visiblePageButtonLength={
              isMobile
                ? PAGE_OPTION.MOBILE_TEMPLATE_BUTTON_LENGTH
                : PAGE_OPTION.TEMPLATE_BUTTON_LENGTH
            }
            itemCountInPage={
              isMobile ? PAGE_OPTION.MOBILE_TEMPLATE_ITEM_SIZE : PAGE_OPTION.TEMPLATE_ITEM_SIZE
            }
            totalItemCount={numberOfTemplates}
            focusedPage={Number(pageNumber)}
            onClickPageButton={handleClickPagination}
            onPageError={handlePageError}
          />
        </div>
      )}
    </LayoutContainer>,
  );
}

export default TemplateListPage;
