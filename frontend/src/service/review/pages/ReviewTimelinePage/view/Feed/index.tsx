import React, { ForwardedRef, forwardRef } from 'react';

import { FlexContainer, Skeleton, Text } from 'common/components';

import Profile from 'service/@shared/components/Profile';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <FlexContainer className={styles.componentFeed} gap="large">
      {children}
    </FlexContainer>
  );
}

interface TitleProps {
  children: string;
}

function Title({ children }: TitleProps) {
  return (
    <Text as="div" className={styles.title} size={24}>
      {children}
    </Text>
  );
}

interface ListProps {
  children: React.ReactNode;
}

function List({ children }: ListProps, ref: React.ForwardedRef<unknown>) {
  return (
    <FlexContainer ref={ref} gap="large">
      {children}
    </FlexContainer>
  );
}

interface ReviewAnswerProps {
  children: React.ReactNode;
}

const ReviewAnswer = React.memo(
  forwardRef(({ children }: ReviewAnswerProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className={styles.reviewAnswer} ref={forwardedRef}>
        {children}
      </div>
    );
  }),
);

ReviewAnswer.displayName = 'ReviewAnswer';

interface UserProfileProps {
  socialId: number;
  profileUrl: string;
  nickname: string;
  update: string;
}

function UserProfile({ socialId, profileUrl, nickname, update }: UserProfileProps) {
  return (
    <Profile socialId={socialId} direction="row" gap="medium">
      <Profile.Image theme="rounded" size="small" src={profileUrl} />

      <Profile.Nickname size={16}>{nickname}</Profile.Nickname>
      <Profile.Description size={12}>{update}</Profile.Description>
    </Profile>
  );
}

interface LoadingProps {
  line: number;
}

const Loading = ({ line }: LoadingProps) => {
  return (
    <>
      {Array.from({ length: line }, (_, index) => (
        <Feed.ReviewAnswer key={index}>
          <Skeleton />
        </Feed.ReviewAnswer>
      ))}
    </>
  );
};

const Feed = Object.assign(Container, {
  Title,
  List: React.forwardRef(List),
  ReviewAnswer,
  UserProfile,
  Loading,
});

export default Feed;
