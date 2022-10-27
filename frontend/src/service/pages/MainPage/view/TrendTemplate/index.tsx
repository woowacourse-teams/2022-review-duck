import { Carousel, Text } from 'common/components';

import styles from './styles.module.scss';

import LayoutContainer from 'service/components/LayoutContainer';

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
      <Text className={styles.title} as="h1" size={24}>
        {children}
      </Text>
    </LayoutContainer>
  );
};

interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps) => {
  return <Carousel className={styles.cardList}>{children}</Carousel>;
};

const TrendTemplate = Object.assign(Container, {
  Title,
  Content,
});

export default TrendTemplate;
