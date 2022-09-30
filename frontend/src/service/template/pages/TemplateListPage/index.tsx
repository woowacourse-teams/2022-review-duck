import { useNavigate, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER, PAGE_OPTION } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import { isInclude } from 'service/@shared/utils';

import { PaginationBar } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import Filter from './view/Filter';

function TemplateListPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();

  const pageNumber = searchParam.get('page') || String(1);

  // QueryString Filter 아래와 같이 타입 좁히는식으로 진행!
  const filterQueryString = searchParam.get('sort');
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const getTemplates = useGetTemplates(currentTab as TemplateFilterType, pageNumber);

  if (getTemplates.isError || getTemplates.isLoading)
    return <>{/* Suspense, ErrorBoundary Used */}</>;

  const { totalNumber, templates } = getTemplates.data;

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

  return (
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
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            className={styles.card}
            onClick={handleTemplateView(template.id)}
          >
            <TemplateCard.Tag usedCount={template.usedCount} />
            <TemplateCard.Title>{template.title}</TemplateCard.Title>
            <TemplateCard.UpdatedAt>{template.elapsedTime}</TemplateCard.UpdatedAt>
            <TemplateCard.Description>{template.description}</TemplateCard.Description>

            <TemplateCard.Profile
              profileUrl={template.creator.profileImage}
              nickname={template.creator.nickname}
              socialNickname={template.creator.snsName}
            />
          </TemplateCard>
        ))}

        <PaginationBar
          className={styles.pagination}
          visiblePageButtonLength={PAGE_OPTION.TEMPLATE_BUTTON_LENGTH}
          itemCountInPage={PAGE_OPTION.TEMPLATE_ITEM_SIZE}
          totalItemCount={totalNumber}
          focusedPage={Number(pageNumber)}
          onClickPageButton={handleClickPagination}
        />
      </div>
    </LayoutContainer>
  );
}

export default TemplateListPage;
