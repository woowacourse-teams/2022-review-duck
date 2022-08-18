import { GetTemplatesResponse } from 'service/@shared/types/template';

import NoResult from 'service/@shared/components/NoResult';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

function TemplateListContainer({ templates }: GetTemplatesResponse) {
  if (templates.length === 0) {
    return <NoResult>템플릿이 없습니다.</NoResult>;
  }
  return (
    <div className={styles.templateContainer}>
      {templates.map((template) => (
        <TemplateCard key={template.info.id} template={template} />
      ))}
    </div>
  );
}

export default TemplateListContainer;
