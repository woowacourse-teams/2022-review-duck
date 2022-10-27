import { Link } from 'react-router-dom';

import { Question } from 'types';

import { FlexContainer, Logo } from 'common/components';

import styles from './styles.module.scss';

import QuestionCard from 'service/components/QuestionCard';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <FlexContainer className={styles.statusContainer} direction="column">
      {children}
    </FlexContainer>
  );
}

interface LinkedLogoProps {
  linkTo: string;
}

function LinkedLogo({ linkTo }: LinkedLogoProps) {
  return (
    <Link to={linkTo}>
      <Logo />
    </Link>
  );
}

interface QuestionPreviewProps {
  questions: Question[];
}

function QuestionPreview({ questions }: QuestionPreviewProps) {
  return (
    <FlexContainer direction="column" gap="large">
      {questions.map(
        (question, index) =>
          question.value && (
            <QuestionCard
              key={index}
              numbering={index + 1}
              type="text"
              title={question.value}
              description={question.description}
            />
          ),
      )}
    </FlexContainer>
  );
}

const Status = Object.assign(Container, { LinkedLogo, QuestionPreview });

export default Status;
