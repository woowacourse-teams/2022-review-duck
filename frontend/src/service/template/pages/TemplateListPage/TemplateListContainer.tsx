import { PAGE_LIST, PAGE_OPTION } from 'constant';

import { PaginationNavigator } from 'common/components';

import { PaginationNavigatorProps } from 'common/components/PaginationNavigator';

import NoResult from 'service/@shared/components/NoResult';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import { GetTemplatesResponse } from 'types/template';

function TemplateListContainer({ templates, numberOfTemplates }: GetTemplatesResponse) {
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
      <PaginationNavigator
        visiblePageButtonLength={
          PAGE_OPTION.TEMPLATE_BUTTON_LENGTH as PaginationNavigatorProps['visiblePageButtonLength']
        }
        itemCountInPage={PAGE_OPTION.TEMPLATE_ITEM_SIZE}
        totalItemCount={numberOfTemplates}
        pathname={location.pathname}
        search={location.search}
      />
    </div>
  );
}

export default TemplateListContainer;
