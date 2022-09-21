import { Link } from 'react-router-dom';

import { UserArticleList } from 'types';

import NoResult from 'service/@shared/components/NoResult';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => {
  return <div className={styles.mainContent}>{children}</div>;
};

interface ArticleProps {
  isMine: boolean;
  article: UserArticleList['articleList'][number];
  titleLink: string;
  editUrl: string;
  onEdit: (editUrl: string) => () => void;
  onDelete: (id: number | string) => () => void;
}

const Article = ({ isMine, article, titleLink, editUrl, onEdit, onDelete }: ArticleProps) => {
  return (
    <div className={styles.reviewContainer}>
      <Questions>
        <Link to={titleLink}>
          <Questions.Title>{article.title}</Questions.Title>
        </Link>
        <Questions.EditButtons
          isVisible={isMine}
          onClickEdit={onEdit(editUrl)}
          onClickDelete={onDelete(article.id || article.reviewFormCode || '')}
        />
        {article.contents.map((content) => (
          <Questions.Answer
            key={content.question.id}
            question={content.question.value}
            description={content.question.description}
          >
            {content.answer?.value}
          </Questions.Answer>
        ))}
        <Questions.Reaction likeCount={0} onClickLike={() => null} onClickBookmark={() => null} />
      </Questions>
    </div>
  );
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

export const ArticleList = Object.assign(Container, { Article, NoArticleResult });
