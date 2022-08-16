import { GetTemplatesResponse } from 'service/@shared/types/template';

import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

interface Props {
  templates: GetTemplatesResponse;
}

function TemplateListContainer({ templates }: Props) {
  return (
    <div className={styles.container}>
      {templates.map(
        ({ templateId, templateTitle, templateDescription, updatedAt, usedCount, creator }) => (
          <div key={templateId}>
            <TemplateCard
              templateId={templateId}
              templateTitle={templateTitle}
              templateDescription={templateDescription}
              updatedAt={updatedAt}
              usedCount={usedCount}
              creator={creator}
            />
          </div>
        ),
      )}
    </div>
  );
}

export default TemplateListContainer;
