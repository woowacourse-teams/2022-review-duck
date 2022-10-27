import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { Button, Text, TransitionDiv } from 'common/components';

import LayoutContainer from 'service/components/LayoutContainer';
import QuestionCard from 'service/components/QuestionCard';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <section className={styles.introBackground}>
      <LayoutContainer className={styles.introContainer}>
        <div className={styles.introText}>{children}</div>

        <div className={styles.heroCard}>
          <TransitionDiv className={styles.decorative} duration={400} appear="drop" direction="up">
            <QuestionCard
              className={cn(styles.question, styles.small)}
              numbering={1}
              title="오늘의 체크인 점수는 몇점인가요?"
              description="1점에서 10점까지 숫자로 입력해주세요."
            />
          </TransitionDiv>

          <TransitionDiv
            className={styles.decorative}
            duration={600}
            appear="drop"
            direction="down"
          >
            <QuestionCard
              className={styles.question}
              numbering={2}
              title="이번 프로젝트에서 배운 점은 무엇인가요?"
              description="200자 이내로 간단하게 작성해주세요."
            />
          </TransitionDiv>

          <TransitionDiv
            className={styles.decorative}
            duration={800}
            appear="drop"
            direction="right"
          >
            <QuestionCard
              className={cn(styles.question, styles.medium)}
              numbering={3}
              title="개선할 수 있는 점은 무엇이 있을까요?"
              description="개선을 위해 어떤 노력을 할 수 있을지 생각해봐요."
            />
          </TransitionDiv>
        </div>
      </LayoutContainer>
    </section>
  );
};

interface TitleProps {
  children: React.ReactNode;
}

const Title = ({ children }: TitleProps) => {
  return (
    <Text as="div" className={styles.title} size={40}>
      {children}
    </Text>
  );
};

interface SubTitleProps {
  children: string;
}

const SubTitle = ({ children }: SubTitleProps) => {
  return (
    <Text className={styles.subTitle} size={16}>
      {children}
    </Text>
  );
};

interface ReviewButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: string;
}

const ReviewButton = ({ onClick, children }: ReviewButtonProps) => {
  return (
    <Button className={styles.reviewButton} theme="outlined" size="medium" onClick={onClick}>
      <FontAwesomeIcon icon={faPenToSquare} />
      {children}
    </Button>
  );
};

const Intro = Object.assign(Container, {
  Title,
  SubTitle,
  ReviewButton,
});

export default Intro;
