import { useEffect, useState } from 'react';

import cn from 'classnames';

import { Button, Icon, Text } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import ReviewList from './containers/ReviewList';
import useMyPageQueries from './useMyPageQueries';
import { MYPAGE_TAB } from 'service/@shared/constants';

function MyPage() {
  const [currentTab, setCurrentTab] = useState(MYPAGE_TAB.MY_REVIEWS);

  const { myReviews, myReviewForms, userProfile, isError, error } = useMyPageQueries();

  useEffect(() => {
    if (isError) {
      alert(error?.message);
    }
  }, [isError, error]);

  const onChangeTab = (filter: string) => () => {
    setCurrentTab(filter);
  };

  return (
    <>
      <div
        className={styles.profileBackground}
        style={{ backgroundImage: `url(${userProfile.profileUrl})` }}
      />

      <LayoutContainer className={styles.container}>
        <aside className={styles.sideContent}>
          <div
            className={styles.profileImage}
            style={{ backgroundImage: `url(${userProfile.profileUrl})` }}
          >
            <div className={styles.activeIcon}>🦖</div>
          </div>

          <div className={styles.nameCard}>
            <Text size={24} weight="bold">
              {userProfile.nickname}
            </Text>

            <Text size={14} weight="lighter">
              {userProfile.socialId}
            </Text>
          </div>

          <div className={styles.profileManage}>
            <Button size="small">
              <Icon code="edit_note" />
              <span>Edit</span>
            </Button>

            <a
              href={`https://github.com/${userProfile.socialId}`}
              target="_blank"
              rel=" noopener noreferrer"
            >
              <Button size="small" theme="outlined">
                <Icon code="person" />
                <span>Github Profile</span>
              </Button>
            </a>
          </div>

          <hr className={styles.line} />

          <ul className={styles.sideMenu}>
            <Text className={styles.title} size={14}>
              회고 목록
            </Text>

            <li
              className={cn(styles.item, { [styles.focus]: currentTab === MYPAGE_TAB.MY_REVIEWS })}
              onClick={onChangeTab(MYPAGE_TAB.MY_REVIEWS)}
              onKeyDown={onChangeTab(MYPAGE_TAB.MY_REVIEWS)}
            >
              작성한 회고글
            </li>
            <li
              className={cn(styles.item, {
                [styles.focus]: currentTab === MYPAGE_TAB.MY_REVIEW_FORMS,
              })}
              onClick={onChangeTab(MYPAGE_TAB.MY_REVIEW_FORMS)}
              onKeyDown={onChangeTab(MYPAGE_TAB.MY_REVIEW_FORMS)}
            >
              생성한 회고
            </li>
          </ul>

          <hr className={styles.line} />

          <div className={styles.counterContainer}>
            <div className={styles.counter}>
              <Text className={styles.number} size={24} weight="bold">
                {myReviews.numberOfReviews}
              </Text>
              <Text size={12}>회고 작성</Text>
            </div>
            <div className={styles.counter}>
              <Text className={styles.number} size={24} weight="bold">
                {myReviewForms.numberOfReviewForms}
              </Text>
              <Text size={12}>생성</Text>
            </div>
          </div>
        </aside>

        <div className={styles.mainContent}>
          <ReviewList
            filter={
              currentTab === MYPAGE_TAB.MY_REVIEWS
                ? MYPAGE_TAB.MY_REVIEWS
                : MYPAGE_TAB.MY_REVIEW_FORMS
            }
          />
        </div>
      </LayoutContainer>
    </>
  );
}

export default MyPage;
