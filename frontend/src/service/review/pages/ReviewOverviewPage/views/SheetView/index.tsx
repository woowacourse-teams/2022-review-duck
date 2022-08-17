import React from 'react';

import Profile from 'service/@shared/components/Profile';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <table className={styles.sheetView}>{children}</table>;
};

interface QuestionsProps {
  children: React.ReactNode;
}

const Questions = ({ children }: QuestionsProps) => {
  return (
    <thead className={styles.questions}>
      <tr>
        <th />
        {children}
      </tr>
    </thead>
  );
};

interface ReviewListProps {
  children: React.ReactNode;
}

const ReviewList = ({ children }: ReviewListProps) => {
  return <tbody className={styles.reviewList}>{children}</tbody>;
};

interface AnswersProps {
  children?: React.ReactNode;
}

const Answers = ({ children }: AnswersProps) => {
  return <tr>{children}</tr>;
};

interface CreatorProps {
  nickname: string;
  profileImage: string;
}

const Creator = ({ nickname, profileImage }: CreatorProps) => {
  return (
    <td>
      <Profile direction="column" align="center" textAlign="center">
        <Profile.Image src={profileImage} size="small" />
        <Profile.Nickname>{nickname}</Profile.Nickname>
      </Profile>
    </td>
  );
};

interface ItemProps {
  isTitle?: boolean;
  children?: string;
}

const Item = ({ isTitle, children }: ItemProps) => {
  return React.createElement(isTitle ? 'th' : 'td', null, children);
};

export const SheetView = Object.assign(Container, {
  ReviewList,
  Questions,
  Answers,
  Creator,
  Item,
});
