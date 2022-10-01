import { PAGE_LIST } from 'constant';
import { Template } from 'types';

import { ScrollPanel, Text } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <>{children}</>;
};

interface TitleProps {
  children: string;
}

const Title = ({ children }: TitleProps) => {
  return (
    <LayoutContainer className={styles.contentHeader}>
      <Text as="h1" size={24}>
        {children}
      </Text>
    </LayoutContainer>
  );
};

interface TrendCardPanelProps {
  templates: Template[];
}

const TrendCardPanel = ({ templates }: TrendCardPanelProps) => {
  return (
    <ScrollPanel className={styles.cardList}>
      {templates.map((template) => (
        <TemplateCard
          key={template.info.id}
          className={styles.mainCard}
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
    </ScrollPanel>
  );
};

const TrendTemplate = Object.assign(Container, { Title, TrendCardPanel });

export default TrendTemplate;
