import React, { ForwardedRef, forwardRef } from 'react';

import { Skeleton } from 'common/components';

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

const ReviewList = (
  { children }: ReviewListProps,
  ref: React.ForwardedRef<HTMLTableSectionElement>,
) => {
  return (
    <tbody ref={ref} className={styles.reviewList}>
      {children}
    </tbody>
  );
};

interface AnswersProps {
  children?: React.ReactNode;
}

const Answers = React.memo(
  forwardRef(({ children }: AnswersProps, forwardedRef: ForwardedRef<HTMLTableRowElement>) => {
    return <tr ref={forwardedRef}>{children}</tr>;
  }),
);

Answers.displayName = 'Answers';

interface CreatorProps {
  socialId: number;
  title: string;
  profileImage: string;
}

const Creator = ({ socialId, title, profileImage }: CreatorProps) => {
  return (
    <td>
      <Profile socialId={socialId} direction="column" align="center" textAlign="center">
        <Profile.Image src={profileImage} size="small" />
        <Profile.Nickname>{title}</Profile.Nickname>
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

interface LoadingProps {
  line: number;
}

const Loading = ({ line }: LoadingProps) => {
  return (
    <>
      {Array.from({ length: line }, (_, index) => (
        <SheetView.Answers key={index}>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </SheetView.Answers>
      ))}
    </>
  );
};

export const SheetView = Object.assign(Container, {
  ReviewList: React.forwardRef(ReviewList),
  Questions,
  Answers,
  Creator,
  Item,
  Loading,
});
