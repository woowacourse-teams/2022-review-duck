import { GetTemplatesResponse } from 'service/@shared/types/template';

import NoResult from 'service/@shared/components/NoResult';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

function TemplateListContainer({ templates }: GetTemplatesResponse) {
  if (templates.length === 0) {
    return <NoResult>템플릿이 없습니다.</NoResult>;
  }
  return (
    <div className={styles.container}>
      {templates.map(({ info, creator }) => (
        <div key={info.id}>
          <TemplateCard info={info} creator={creator} />
        </div>
      ))}
    </div>
  );
}

export default TemplateListContainer;
