import { Link } from 'react-router-dom';

import { UserItemList } from 'types';

import NoResult from 'service/@shared/components/NoResult';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => {
  return <div className={styles.mainContent}>{children}</div>;
};

interface ItemProps {
  isMine: boolean;
  item: UserItemList['itemList'][number];
  titleLink: string;
  editUrl: string;
  onEdit: (editUrl: string) => () => void;
  onDelete: (id: number | string) => () => void;
}

const Item = ({ isMine, item, titleLink, editUrl, onEdit, onDelete }: ItemProps) => {
  return (
    <div className={styles.reviewContainer}>
      <Questions>
        <Link to={titleLink}>
          <Questions.Title>{item.title}</Questions.Title>
        </Link>
        <Questions.EditButtons
          isVisible={isMine}
          onClickEdit={onEdit(editUrl)}
          onClickDelete={onDelete(item.id || item.reviewFormCode || '')}
        />
        {item.contents.map((content) => (
          <Questions.Answer
            key={content.question.id}
            question={content.question.value}
            description={content.question.description}
          >
            {content.answer?.value}
          </Questions.Answer>
        ))}
        <Questions.Reaction onClickLike={() => null} onClickBookmark={() => null} />
      </Questions>
    </div>
  );
};

interface NoItemResultProps {
  totalNumber: number;
  children: string;
}

const NoItemResult = ({ totalNumber, children }: NoItemResultProps) => {
  if (totalNumber === 0) {
    return <NoResult className={styles.noResult}>{children}</NoResult>;
  }
  return <></>;
};

export const ItemList = Object.assign(Container, { Item, NoItemResult });
