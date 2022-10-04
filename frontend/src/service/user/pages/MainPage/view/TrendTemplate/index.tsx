import { ScrollPanel, Text } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

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

interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps) => {
  return <ScrollPanel className={styles.cardList}>{children}</ScrollPanel>;
};

const TrendTemplate = Object.assign(Container, {
  Title,
  Content,
});

export default TrendTemplate;
