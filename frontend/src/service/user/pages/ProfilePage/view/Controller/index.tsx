import React from 'react';

import { faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { GITHUB_PROFILE_URL, USER_PROFILE_TAB } from 'constant';
import { Tabs } from 'types';

import { Text, Button } from 'common/components';

import styles from './styles.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <aside className={styles.sideContent}>{children}</aside>;
};

const Profile = ({ profileUrl }: Record<string, string>) => {
  return (
    <div className={styles.profileImage} style={{ backgroundImage: `url(${profileUrl})` }}>
      <div className={styles.activeIcon}>🦖</div>
    </div>
  );
};

interface NameCardProps {
  nickname: string;
  socialNickname: string;
}

const NameCard = ({ nickname, socialNickname }: NameCardProps) => {
  return (
    <div className={styles.nameCard}>
      <Text size={24} weight="bold">
        {nickname}
      </Text>

      <Text size={14} weight="lighter">
        {socialNickname}
      </Text>
    </div>
  );
};

interface ProfileManagerProps {
  isMyProfile: boolean;
  socialNickname: string;
  onEditButtonClick: (event: React.MouseEvent) => void;
}

const ProfileManager = ({
  isMyProfile,
  socialNickname,
  onEditButtonClick,
}: ProfileManagerProps) => {
  return (
    <div className={styles.profileManage}>
      {isMyProfile && (
        <Button size="small" onClick={onEditButtonClick}>
          <FontAwesomeIcon icon={faPenToSquare} />
          <span>Edit</span>
        </Button>
      )}

      <a href={`${GITHUB_PROFILE_URL}${socialNickname}`} target="_blank" rel=" noopener noreferrer">
        <Button size="small" theme="outlined">
          <FontAwesomeIcon icon={faUser} />
          <span>Github Profile</span>
        </Button>
      </a>
    </div>
  );
};

interface TabNavigatorProps {
  currentTab: Tabs;
  onTabClick: (filter: string) => () => void;
}

const TabNavigator = ({ currentTab, onTabClick }: TabNavigatorProps) => {
  return (
    <ul className={styles.sideMenu}>
      <Text className={styles.title} size={14}>
        회고 목록
      </Text>

      <li
        className={cn(styles.item, {
          [styles.focus]: currentTab === USER_PROFILE_TAB.REVIEWS,
        })}
        onClick={onTabClick(USER_PROFILE_TAB.REVIEWS)}
      >
        작성한 회고글
      </li>
      <li
        className={cn(styles.item, {
          [styles.focus]: currentTab === USER_PROFILE_TAB.REVIEW_FORMS,
        })}
        onClick={onTabClick(USER_PROFILE_TAB.REVIEW_FORMS)}
      >
        생성한 질문지
      </li>
      <li
        className={cn(styles.item, {
          [styles.focus]: currentTab === USER_PROFILE_TAB.TEMPLATES,
        })}
        onClick={onTabClick(USER_PROFILE_TAB.TEMPLATES)}
      >
        생성한 템플릿
      </li>
    </ul>
  );
};

interface RecordProps {
  title: string;
  numberOfItems: number;
}

const Record = ({ numberOfItems, title }: RecordProps) => {
  return (
    <div className={styles.counterContainer}>
      <div className={styles.counter}>
        <Text className={styles.number} size={24} weight="bold">
          {numberOfItems}
        </Text>
        <Text size={12}>{title}</Text>
      </div>
    </div>
  );
};

export const Controller = Object.assign(Container, {
  Profile,
  NameCard,
  ProfileManager,
  TabNavigator,
  Record,
});
