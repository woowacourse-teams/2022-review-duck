import { ForwardedRef, forwardRef, useRef } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare, faRightToBracket, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { ReviewFormAnswer } from 'service/types';

import useSnackbar from 'common/hooks/useSnackbar';

import { Text, FlexContainer, Button, TextBox, Skeleton, Carousel } from 'common/components';
import NoResult from 'service/components/NoResult';

import { PAGE_LIST } from 'constant';

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

const Content = (
  { isLoading, fallback, children }: ContentProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  return (
    <FlexContainer className={styles.contentContainer} ref={ref} direction="column" gap="large">
      {isLoading ? fallback : children}
    </FlexContainer>
  );
};

interface ParticipantListProps extends ContainerProps {
  listLength?: number;
}

const ParticipantList = ({ children }: ParticipantListProps) => {
  const childrenLength = React.Children.count(children);

  return (
    <FlexContainer
      className={cn(styles.cardBox, styles.participantList)}
      direction="column"
      gap="medium"
    >
      <Text className={styles.title} as="h5" size={20}>
        이 회고에 참여한 사람
      </Text>

      {childrenLength > 0 ? (
        <Carousel centerDisabled={true}>{children}</Carousel>
      ) : (
        <NoResult className={styles.noResult}>아직 참여한 사람이 없습니다.</NoResult>
      )}
    </FlexContainer>
  );
};

interface ReviewProps {
  children: React.ReactNode;
}

const Review = React.memo(
  forwardRef(({ children }: ReviewProps, forwardedRef: ForwardedRef<HTMLElement>) => {
    return (
      <section className={cn(styles.cardBox, styles.reviewContainer)} ref={forwardedRef}>
        {children}
      </section>
    );
  }),
);

Review.displayName = 'Review';

interface SideMenuProps {
  isLoading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const SideMenu = ({ isLoading, fallback, children }: SideMenuProps) => {
  return <aside className={styles.sideMenu}>{isLoading ? fallback : children}</aside>;
};

interface FormDetailProps {
  reviewFormCode: string;
  editable?: boolean;
  children: React.ReactNode;
}

const FormDetail = ({ reviewFormCode, editable = false, children }: FormDetailProps) => {
  return (
    <FlexContainer className={cn(styles.cardBox, styles.formDetail)}>
      <FlexContainer direction="row" align="center" justify="space-between">
        <Text size={20} weight="bold">
          회고 정보
        </Text>

        {editable && (
          <Link
            to={`${PAGE_LIST.REVIEW_FORM}/${reviewFormCode}?redirect=${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`}
          >
            <button type="button" className={styles.buttonReviewFormEdit}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>질문 수정</span>
            </button>
          </Link>
        )}
      </FlexContainer>

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
        <FontAwesomeIcon icon={faRightToBracket} />
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
  const snackbar = useSnackbar();

  const handleCopyInviteLink = async () => {
    const $copyLink = linkInputRef.current;

    if (!$copyLink) return;

    try {
      await navigator.clipboard.writeText($copyLink.value);
      snackbar.show({
        icon: faCircleCheck,
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

interface LoadingProps {
  line: number;
}

const Loading = ({ line }: LoadingProps) => {
  return (
    <>
      {Array.from({ length: line }, (_, index) => (
        <ListView.Review key={index}>
          <Skeleton />
        </ListView.Review>
      ))}
    </>
  );
};

export const ListView = Object.assign(Container, {
  Content: React.forwardRef(Content),
  ParticipantList,
  Review,
  SideMenu,
  FormDetail,
  InfoText,
  JoinButton,
  FormCopyLink,
  ReviewShortcutList,
  ReviewShortcut,
  Loading,
});
