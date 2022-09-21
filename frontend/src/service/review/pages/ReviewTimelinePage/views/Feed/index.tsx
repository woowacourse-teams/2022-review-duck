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

function List({ children }: ListProps) {
  return <FlexContainer gap="large">{children}</FlexContainer>;
}

interface ReviewAnswerProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const ReviewAnswer = forwardRef(
  ({ isLoading, children }: ReviewAnswerProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className={styles.reviewAnswer} ref={forwardedRef}>
        {isLoading ? <Skeleton /> : children}
      </div>
    );
  },
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

const Feed = Object.assign(Container, {
  Title,
  List,
  ReviewAnswer,
  UserProfile,
});

export default Feed;
