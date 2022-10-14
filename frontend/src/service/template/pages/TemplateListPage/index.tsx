import { useNavigate, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER, PAGE_OPTION } from 'constant';
import { TemplateFilterType } from 'types';

import { isNumberString } from 'common/utils/validator';
import { getElapsedTimeText, isInclude } from 'service/@shared/utils';

import { PaginationBar } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import NoResult from 'service/@shared/components/NoResult';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import useTemplateList from './useTemplateListPage';
import Filter from './view/Filter';

function TemplateListPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();

  const pageNumberParams = searchParam.get('page');
  const pageNumber = isNumberString(pageNumberParams) ? Number(pageNumberParams) : 1;

  const filterQueryString = searchParam.get('sort');
  const searchQueryString = searchParam.get('search') || '';

  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const { numberOfTemplates, templates } = useTemplateList(
    currentTab,
    pageNumber,
    searchQueryString,
  );

  const handleTemplateView = (id: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${id}?sort=${currentTab}`);
  };

  const handleChangeSortList = (query: TemplateFilterType) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_LIST}?sort=${query}`);
  };

  const handleMoveCreateTemplate = () => {
    navigate(PAGE_LIST.TEMPLATE_FORM);
  };

  const handleClickPagination = (pageNumber: number) => {
    if (searchQueryString) {
      setSearchParam({ search: searchQueryString, page: String(pageNumber) });
    } else {
      setSearchParam({ sort: currentTab, page: String(pageNumber) });
    }
    window.scrollTo(0, 0);
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

        <Filter.MoreButtons onClickCreate={handleMoveCreateTemplate} />
      </Filter>

      <div className={styles.templateContainer}>
        {templates.map(({ info, creator }) => (
          <TemplateCard key={info.id} className={styles.card} onClick={handleTemplateView(info.id)}>
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
          visiblePageButtonLength={PAGE_OPTION.TEMPLATE_BUTTON_LENGTH}
          itemCountInPage={PAGE_OPTION.TEMPLATE_ITEM_SIZE}
          totalItemCount={numberOfTemplates}
          focusedPage={Number(pageNumber)}
          onClickPageButton={handleClickPagination}
        />
      </div>
      {numberOfTemplates === 0 && <NoResult>템플릿이 없습니다.</NoResult>}
    </LayoutContainer>,
  );
}

export default TemplateListPage;
