import {
  faArrowDown,
  faFeatherPointed,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, FlexContainer, Text, ToolTip } from 'common/components';

import TagLabel from 'common/components/TagLabel';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <FlexContainer
      className={styles.componentPageHeader}
      direction="row"
      justify="space-between"
      align="center"
    >
      {children}
    </FlexContainer>
  );
}

interface TitleProps {
  usedCount: number;
  nickname: string;
  elapsedTime: ElapsedTime;
  children: string;
}

function Title({ usedCount, nickname, elapsedTime, children }: TitleProps) {
  return (
    <FlexContainer gap="medium">
      <Text className={styles.title} as="h1" size={28} weight="bold">
        {children}
      </Text>

      <FlexContainer className={styles.articleInfo} direction="row" align="center" gap="medium">
        <TagLabel>
          <FontAwesomeIcon icon={faArrowDown} />
          <span>{usedCount}회</span>
        </TagLabel>

        <Text className={styles.text}>
          <b>작성</b> : {nickname}
        </Text>

        <Text className={styles.text}>
          <b>업데이트</b> : {elapsedTime}
        </Text>
      </FlexContainer>
    </FlexContainer>
  );
}

interface ActionButtonsProps {
  editable?: boolean;
  onClickCreateReviewForm: React.MouseEventHandler<HTMLButtonElement>;
  onClickStartReview: React.MouseEventHandler<HTMLButtonElement>;
  onClickEdit: React.MouseEventHandler<HTMLDivElement>;
  onClickDelete: React.MouseEventHandler<HTMLDivElement>;
}

function Buttons({
  editable = false,
  onClickCreateReviewForm,
  onClickStartReview,
  onClickEdit,
  onClickDelete,
}: ActionButtonsProps) {
  return (
    <FlexContainer className={styles.buttons} gap="medium">
      <FlexContainer className={styles.startReview} direction="row" gap="medium">
        <ToolTip
          text="이 템플릿으로 다른 사람들과 회고를 할 수 있는 페이지를 생성할 수 있습니다."
          align="bottom"
        >
          <Button onClick={onClickCreateReviewForm}>
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>질문지 만들기</span>
          </Button>
        </ToolTip>

        <ToolTip text="이 템플릿으로 즉시 회고를 시작할 수 있습니다." align="bottom">
          <Button theme="outlined" onClick={onClickStartReview}>
            <FontAwesomeIcon icon={faFeatherPointed} />
            <span>회고 시작하기</span>
          </Button>
        </ToolTip>
      </FlexContainer>

      {editable && (
        <FlexContainer direction="row" justify="right" gap="medium">
          <Text as="div" className={styles.editableText} aria-label="수정" onClick={onClickEdit}>
            <FontAwesomeIcon icon={faPenToSquare} /> <span>편집</span>
          </Text>

          <Text as="div" className={styles.editableText} aria-label="삭제" onClick={onClickDelete}>
            <FontAwesomeIcon icon={faTrash} /> <span>삭제</span>
          </Text>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

const Header = Object.assign(Container, {
  Title,
  Buttons,
});

export default Header;
