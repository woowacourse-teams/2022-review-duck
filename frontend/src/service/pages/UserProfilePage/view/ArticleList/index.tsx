import styles from './styles.module.scss';

import NoResult from 'service/components/NoResult';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => {
  return <div className={styles.mainContent}>{children}</div>;
};

interface NoArticleResultProps {
  totalNumber: number;
  children: string;
}

const NoArticleResult = ({ totalNumber, children }: NoArticleResultProps) => {
  if (totalNumber === 0) {
    return <NoResult className={styles.noResult}>{children}</NoResult>;
  }
  return <></>;
};

const ArticleList = Object.assign(Container, { NoArticleResult });

export default ArticleList;
