import { useRef } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';
import { ReviewFormAnswer } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';

import { Text, FlexContainer, Button, Icon, TextBox } from 'common/components';

import ScrollPanel from 'common/components/ScrollPanel';

import styles from './styles.module.scss';

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
        <Text as="h5" size={20}>
          이 회고에 참여한 사람
        </Text>
      </div>

      <ScrollPanel centerDisabled={true}>{children}</ScrollPanel>
    </FlexContainer>
  );
};

interface ReviewProps {
  children: React.ReactNode;
}

const Review = ({ children }: ReviewProps) => {
  return <section className={cn(styles.cardBox, styles.reviewContainer)}>{children}</section>;
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
    <FlexContainer className={cn(styles.cardBox, styles.formDetail)}>
      <Text size={20} weight="bold">
        회고 정보
      </Text>

      {children}
    </FlexContainer>
  );
};

interface InfoTextProps {
  name: string;
  children?: React.ReactNode;
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
  const linkInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();

  const handleCopyInviteLink = async () => {
    const $copyLink = linkInputRef.current;

    if (!$copyLink) return;

    try {
      await navigator.clipboard.writeText($copyLink.value);
      showSnackbar({
        icon: 'done',
        title: '참여 링크를 클립보드에 복사했습니다.',
        description: '함께 회고할 팀원들에게 공유해주세요.',
      });
    } catch (e) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <FlexContainer className={styles.formCopyLink} gap="small">
      <Text className={styles.title}>회고 링크</Text>

      <div className={styles.copyBox}>
        <TextBox
          ref={linkInputRef}
          className={styles.copyInfo}
          size="small"
          value={`${location.origin}/overview/${reviewFormCode}`}
          readOnly
        />

        <Text as="div" size={12} className={styles.copyText} onClick={handleCopyInviteLink}>
          복사
        </Text>
      </div>
    </FlexContainer>
  );
};

interface FormManageButtonsProps {
  reviewFormCode: string;
  isMine?: boolean;
}

const FormManageButtons = ({ reviewFormCode, isMine }: FormManageButtonsProps) => {
  if (!isMine) return null;

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

        <Button theme="outlined" size="small" disabled={false}>
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
