import { useSearchParams } from 'react-router-dom';

import { PAGE_LIST, PAGE_OPTION } from 'constant';
import { TemplateFilterType } from 'types';

import { PaginationBar } from 'common/components';

import { PaginationBarProps } from 'common/components/PaginationBar';

import NoResult from 'service/@shared/components/NoResult';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import { GetTemplatesResponse } from 'types/template';

interface TemplateListContainerProps extends GetTemplatesResponse {
  currentTab: TemplateFilterType;
  pageNumber: string;
}

function TemplateListContainer({
  templates,
  numberOfTemplates,
  currentTab,
  pageNumber,
}: TemplateListContainerProps) {
  const [_, setSearchParam] = useSearchParams();

  const movePage = (pageNumber: number) => {
    setSearchParam({ filter: currentTab, page: String(pageNumber) });
    window.scrollTo(0, 0);
  };

  if (templates.length === 0) {
    return <NoResult>템플릿이 없습니다.</NoResult>;
  }
  return (
    <div className={styles.templateContainer}>
      {templates.map((template) => (
        <TemplateCard
          key={template.info.id}
          className={styles.card}
          link={`${PAGE_LIST.TEMPLATE_DETAIL}/${template.info.id}`}
        >
          <TemplateCard.Tag usedCount={template.info.usedCount} />
          <TemplateCard.Title title={template.info.title} />
          <TemplateCard.UpdatedAt updatedAt={template.info.updatedAt} />
          <TemplateCard.Description description={template.info.description} />

          <TemplateCard.Profile
            profileUrl={template.creator.profileUrl}
            nickname={template.creator.nickname}
            socialNickname={template.creator.socialNickname || ''}
          />
        </TemplateCard>
      ))}
      <PaginationBar
        visiblePageButtonLength={
          PAGE_OPTION.TEMPLATE_BUTTON_LENGTH as PaginationBarProps['visiblePageButtonLength']
        }
        itemCountInPage={PAGE_OPTION.TEMPLATE_ITEM_SIZE}
        totalItemCount={numberOfTemplates}
        focusedPage={Number(pageNumber)}
        onClickPageButton={movePage}
      />
    </div>
  );
}

export default TemplateListContainer;
