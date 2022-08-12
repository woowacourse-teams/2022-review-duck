import { GetTemplatesResponse } from 'service/@shared/types/template';

import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

function TemplateListContainer({ templates }: GetTemplatesResponse) {
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
