import { Link } from 'react-router-dom';

import { GetTemplatesResponse } from 'service/@shared/types/template';

import NoResult from 'service/@shared/components/NoResult';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import { PAGE_LIST } from 'service/@shared/constants';

function TemplateListContainer({ templates }: GetTemplatesResponse) {
  if (templates.length === 0) {
    return <NoResult>템플릿이 없습니다.</NoResult>;
  }
  return (
    <div className={styles.templateContainer}>
      {templates.map((template) => (
        <TemplateCard key={template.info.id} className={styles.card}>
          <Link to={`${PAGE_LIST.TEMPLATE_DETAIL}/${template.info.id}`}>
            <TemplateCard.Tag usedCount={template.info.usedCount} />
            <TemplateCard.Title title={template.info.title} />
            <TemplateCard.UpdatedAt updatedAt={template.info.updatedAt} />
            <TemplateCard.Description description={template.info.description} />
            <TemplateCard.Line />
          </Link>
          <Link to={`${PAGE_LIST.USER_PROFILE}/${template.creator.id}`}>
            <TemplateCard.Profile
              profileUrl={template.creator.profileUrl}
              nickname={template.creator.nickname}
              socialNickname={template.creator.socialNickname || ''}
            />
          </Link>
        </TemplateCard>
      ))}
    </div>
  );
}

export default TemplateListContainer;
