import { useNavigate, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER, PAGE_OPTION } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import { isNumber } from 'common/utils/validator';
import { getElapsedTimeText, isInclude } from 'service/@shared/utils';

import { PaginationBar } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import Filter from './view/Filter';

function TemplateListPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();

  const pageNumberParams = Number(searchParam.get('page'));
  const pageNumber = isNumber(pageNumberParams) ? pageNumberParams : 1;

  const filterQueryString = searchParam.get('sort');
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const getTemplates = useGetTemplates({
    filter: currentTab,
    pageNumber,
  });

  if (getTemplates.isError || getTemplates.isLoading)
    return <>{/* Suspense, ErrorBoundary Used */}</>;

  const { numberOfTemplates, templates } = getTemplates.data;

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
    setSearchParam({ sort: currentTab, page: String(pageNumber) });
    window.scrollTo(0, 0);
  };

  return PageSuspense(
    <LayoutContainer>
      <Filter>
        <Filter.SortList
          focusedOption={currentTab}
          sortOptions={[
            { icon: faArrowTrendUp, query: FILTER.TEMPLATE_TAB.TREND, name: '트랜딩' },
            { icon: faBarsStaggered, query: FILTER.TEMPLATE_TAB.LATEST, name: '최신' },
          ]}
          onClickSortButton={handleChangeSortList}
        />

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
    </LayoutContainer>,
  );
}

export default TemplateListPage;
