import { faEraser, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { FlexContainer, Text } from 'common/components';

import Profile from 'service/@shared/components/Profile';

import styles from './styles.module.scss';

import Reactions from '../Reactions';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

function Container({ className, children }: ContainerProps) {
  return (
    <FlexContainer className={className} gap="small">
      {children}
    </FlexContainer>
  );
}

interface CoverProfileProps {
  socialId: number;
  image: string;
  title: string;
  description?: string;
}

function CoverProfile({ socialId, image, title, description }: CoverProfileProps) {
  return (
    <Profile socialId={socialId} align="center" textAlign="center" textGap="medium">
      <Profile.Image src={image} />
      <Profile.Nickname size={20}>{title}</Profile.Nickname>
      {description && <Profile.Description>{description}</Profile.Description>}
    </Profile>
  );
}

interface TitleProps {
  children?: string;
}

function Title({ children }: TitleProps) {
  return (
    <Text as="h1" className={styles.title} size={24} weight="bold">
      {children}
    </Text>
  );
}

interface EditButtonsProps {
  className?: string;
  isVisible?: boolean;
  onClickEdit: React.MouseEventHandler<HTMLDivElement>;
  onClickDelete: React.MouseEventHandler<HTMLDivElement>;
}

function EditButtons({ className, isVisible, onClickEdit, onClickDelete }: EditButtonsProps) {
  if (!isVisible) return null;

  return (
    <FlexContainer
      className={cn(styles.inlineButtons, className)}
      direction="row"
      gap="large"
      justify="right"
    >
      <FlexContainer className={styles.button} direction="row" align="center" onClick={onClickEdit}>
        <FontAwesomeIcon icon={faPenToSquare} />
        <Text className={styles.text} size={14}>
          회고 편집
        </Text>
      </FlexContainer>

      <FlexContainer
        className={styles.button}
        direction="row"
        align="center"
        onClick={onClickDelete}
      >
        <FontAwesomeIcon icon={faEraser} />
        <Text className={styles.text} size={14}>
          회고 삭제
        </Text>
      </FlexContainer>
    </FlexContainer>
  );
}

interface AnswerProps {
  question: string;
  description?: string;
  children?: React.ReactNode;
}

function Answer({ question, description, children }: AnswerProps) {
  return (
    <FlexContainer className={styles.answerContainer}>
      <Text className={styles.question} size={20} weight="bold">
        {question}
      </Text>

      {description && (
        <Text className={styles.description} size={14} weight="lighter">
          {description}
        </Text>
      )}

      <Text className={styles.answer} size={16}>
        {children}
      </Text>
    </FlexContainer>
  );
}

interface ReactionProps {
  likeCount: number;
  onClickLike: React.MouseEventHandler<HTMLButtonElement>;
  onClickBookmark: React.MouseEventHandler<HTMLButtonElement>;
}

function Reaction({ likeCount, onClickLike, onClickBookmark }: ReactionProps) {
  return (
    <FlexContainer
      className={cn(styles.inlineButtons, styles.reaction)}
      direction="row"
      gap="large"
    >
      <Reactions>
        <Reactions.LikeButton count={likeCount} onClick={onClickLike} />
      </Reactions>
    </FlexContainer>
  );
}

const Questions = Object.assign(Container, {
  CoverProfile,
  Title,
  EditButtons,
  Answer,
  Reaction,
});

export default Questions;
