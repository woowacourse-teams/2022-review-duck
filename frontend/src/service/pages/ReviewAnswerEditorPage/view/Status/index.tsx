import { Link } from 'react-router-dom';

import { Logo, ProgressBar, Text } from 'common/components';

import FlexContainer from 'common/components/FlexContainer';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <FlexContainer className={styles.container} gap="medium">
      {children}
    </FlexContainer>
  );
};

interface LogoLinkProps {
  link: string;
}

const LogoButton = ({ link }: LogoLinkProps) => {
  return (
    <Link to={link}>
      <Logo />
    </Link>
  );
};

interface FocusQuestionProps {
  description: string;
  children: string;
}

interface FormTitleProps {
  children: React.ReactNode;
}

const FormTitle = ({ children }: FormTitleProps) => {
  return (
    <Text className={styles.formTitle} as="h1" size={24} weight="bold">
      {children}
    </Text>
  );
};

const FocusQuestion = ({ description, children }: FocusQuestionProps) => {
  return (
    <FlexContainer className={styles.focusQuestion} gap="medium">
      <Text as="h2" key={`title-${children}`} className={styles.title} size={40} weight="bold">
        {children}
      </Text>

      <Text as="h3" key={`description-${children}`} className={styles.description} size={16}>
        {description}
      </Text>
    </FlexContainer>
  );
};

interface AnsweredStateProps {
  answeredCount: number;
  questionCount: number;
}

const AnsweredState = ({ answeredCount, questionCount }: AnsweredStateProps) => {
  return (
    <FlexContainer className={styles.answeredState} gap="medium">
      <ProgressBar percent={(answeredCount / questionCount) * 100} />

      <Text className={styles.progressText} size={14}>
        총 {answeredCount}개의 질문 중 {questionCount}개 답변됨
      </Text>
    </FlexContainer>
  );
};

interface UserProfile {
  nickname?: string;
  profileImage?: string;
  description?: string;
}

const UserProfile = ({ nickname, profileImage, description }: UserProfile) => {
  return (
    <FlexContainer className={styles.userProfile} gap="small">
      <div className={styles.profile} style={{ backgroundImage: `url(${profileImage})` }} />
      <Text className={styles.nickname} size={24} weight="bold">
        {nickname}
      </Text>

      <Text className={styles.description} size={14} weight="lighter">
        {description}
      </Text>
    </FlexContainer>
  );
};

export const Status = Object.assign(Container, {
  LogoButton,
  FormTitle,
  FocusQuestion,
  AnsweredState,
  UserProfile,
});
