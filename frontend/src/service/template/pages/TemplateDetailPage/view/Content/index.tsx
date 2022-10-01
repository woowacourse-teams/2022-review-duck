import { faList, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, FlexContainer, Text } from 'common/components';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return <FlexContainer className={styles.componentPageContent}>{children}</FlexContainer>;
}

interface DetailProps {
  description: string;
  children: React.ReactNode;
}

function Detail({ description, children }: DetailProps) {
  return (
    <FlexContainer className={styles.detail}>
      <FlexContainer gap="medium">
        <Text className={styles.title} size={18} weight="bold">
          템플릿 소개
        </Text>
        <FlexContainer className={styles.description}>{description}</FlexContainer>
      </FlexContainer>

      <FlexContainer gap="medium">
        <Text className={styles.title} size={18} weight="bold">
          질문 목록
        </Text>
        {children}
      </FlexContainer>
    </FlexContainer>
  );
}

interface MoreButtonsProps {
  onClickList: React.MouseEventHandler<HTMLButtonElement>;
  onClickCreateTemplate: React.MouseEventHandler<HTMLButtonElement>;
}

function MoreButtons({ onClickList, onClickCreateTemplate }: MoreButtonsProps) {
  return (
    <FlexContainer className={styles.moreButtons} direction="row" gap="medium" justify="right">
      <Button size="medium" onClick={onClickCreateTemplate}>
        <FontAwesomeIcon icon={faPenToSquare} />
        <span>새 템플릿 작성</span>
      </Button>

      <Button size="medium" theme="outlined" onClick={onClickList}>
        <FontAwesomeIcon icon={faList} />
        <span>목록</span>
      </Button>
    </FlexContainer>
  );
}

const Content = Object.assign(Container, {
  Detail,
  MoreButtons,
});

export default Content;
