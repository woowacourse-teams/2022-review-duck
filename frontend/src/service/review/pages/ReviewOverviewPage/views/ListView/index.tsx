import { useRef } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';

import { ReviewFormAnswer } from 'service/@shared/types';

import { Text, FlexContainer, Button, Icon, TextBox } from 'common/components';

import QuestionContent from 'service/@shared/components/QuestionContent';
import Profile from 'service/review/components/Profile';
import Reaction from 'service/review/components/Reaction';

import styles from './styles.module.scss';

import { PAGE_LIST } from 'service/@shared/constants';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <main className={styles.container}>{children}</main>;
};

interface ContentProps {
  isLoading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const Content = ({ isLoading, fallback, children }: ContentProps) => {
  return (
    <FlexContainer direction="column" gap="large">
      {isLoading ? fallback : children}
    </FlexContainer>
  );
};

type ParticipantListProps = ContainerProps;

const ParticipantList = ({ children }: ParticipantListProps) => {
  return (
    <FlexContainer className={styles.cardBox} direction="column" gap="medium">
      <div className={styles.title}>
        <Text size={20} element="h5">
          이 회고에 참여한 사람
        </Text>
      </div>

      <FlexContainer className={styles.profileList} direction="row" gap="small">
        {children}
      </FlexContainer>
    </FlexContainer>
  );
};

const Review = () => {
  return (
    <section className={cn(styles.cardBox, styles.reviewContainer)}>
      <Profile type="round" image={''} title={'타이틀'} description={'0일 전 작성'} />

      <hr />

      <QuestionContent />

      <hr />

      <Reaction />
    </section>
  );
};

interface SideMenuProps {
  isLoading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const SideMenu = ({ isLoading, fallback, children }: SideMenuProps) => {
  return <aside className={styles.sideMenu}>{isLoading ? fallback : children}</aside>;
};

type FormDetailProps = ContainerProps;

const FormDetail = ({ children }: FormDetailProps) => {
  return (
    <FlexContainer className={styles.cardBox} gap="medium">
      <Text className={styles.formDetailTitle} size={20} weight="bold">
        회고 정보
      </Text>

      {children}
    </FlexContainer>
  );
};

interface InfoTextProps {
  name: string;
  children: string;
}

const InfoText = ({ name, children }: InfoTextProps) => {
  return (
    <FlexContainer className={styles.infoText} direction="row" justify="space-between">
      <Text className={styles.name} size={14} weight="lighter">
        {name}
      </Text>

      <Text className={styles.content} size={14} weight="lighter">
        {children}
      </Text>
    </FlexContainer>
  );
};

interface JoinButtonProps {
  reviewFormCode: string;
}

const JoinButton = ({ reviewFormCode }: JoinButtonProps) => {
  return (
    <Link to={`${PAGE_LIST.REVIEW}/${reviewFormCode}`}>
      <Button className={styles.formAnswerJoinButton} theme="outlined">
        <Icon code="group_add" />
        <span>이 회고에 참여하기</span>
      </Button>
    </Link>
  );
};

interface FormCopyLink {
  reviewFormCode: string;
}

const FormCopyLink = ({ reviewFormCode }: FormCopyLink) => {
  const linkInpuRef = useRef<HTMLInputElement>(null);

  return (
    <FlexContainer className={styles.formCopyLink} gap="small">
      <Text className={styles.title}>회고 링크</Text>

      <div className={styles.copyBox}>
        <TextBox
          ref={linkInpuRef}
          className={styles.copyInfo}
          size="small"
          value={`${location.origin}/overview/${reviewFormCode}`}
          readOnly
        />

        <Text size={12} className={styles.copyText}>
          복사
        </Text>
      </div>
    </FlexContainer>
  );
};

interface FormManageButtonsProps {
  reviewFormCode: string;
}

const FormManageButtons = ({ reviewFormCode }: FormManageButtonsProps) => {
  return (
    <FlexContainer className={styles.formManageButtons} gap="small">
      <Text className={styles.title} size={14}>
        회고 관리
      </Text>

      <div className={styles.buttonContainer}>
        <Link to={`${PAGE_LIST.REVIEW_FORM}/${reviewFormCode}`}>
          <Button size="small">
            <Icon code="edit_note" />
            <span>질문 수정</span>
          </Button>
        </Link>

        <Button theme="outlined" size="small">
          <Icon code="share" />
          <span>템플릿 공유</span>
        </Button>
      </div>
    </FlexContainer>
  );
};

type ReviewShortcutListProps = ContainerProps;

const ReviewShortcutList = ({ children }: ReviewShortcutListProps) => {
  return (
    <div className={styles.cardBox}>
      <Text size={20} weight="bold">
        작성된 회고 목록
      </Text>

      <div>{children}</div>
    </div>
  );
};

const ReviewShortcut = ({ id, info }: ReviewFormAnswer) => {
  return (
    <a href={`#${id}`} key={id}>
      <div className={styles.listItemContainer} role="button" tabIndex={0}></div>
    </a>
  );
};

export const ListView = Object.assign(Container, {
  Content,
  ParticipantList,
  Review,
  SideMenu,
  FormDetail,
  InfoText,
  JoinButton,
  FormCopyLink,
  FormManageButtons,
  ReviewShortcutList,
  ReviewShortcut,
});
