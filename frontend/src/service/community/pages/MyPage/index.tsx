import { useState } from 'react';

import ProfileCard from 'service/community/components/ProfileCard';

import styles from './styles.module.scss';

import ReviewList from './containers/ReviewList';
import { MYPAGE_TAB } from 'service/@shared/constants';

const user = {
  profileUrl: 'hello',
  githubNickname: 'lunatic',
  githubStatus: 'world',
  nickname: '루나',
  numberOfReviews: 12,
  numberOfRevieForms: 4,
};

function MyPage() {
  const [currentTab, setCurrentTab] = useState(MYPAGE_TAB.MY_REVIEWS);
  /* TODO: 사용자 관련 정보 API 요청 */

  return (
    <div className={styles.mypageContainer}>
      <ProfileCard user={user} />

      <div className={styles.tabContainer}>
        <button onClick={() => setCurrentTab(MYPAGE_TAB.MY_REVIEWS)}>작성한 회고 보기</button>
        <button onClick={() => setCurrentTab(MYPAGE_TAB.MY_REVIEW_FORMS)}>생성한 회고 보기</button>
      </div>

      <section className={styles.reviewListContainer}>
        {currentTab === MYPAGE_TAB.MY_REVIEWS ? (
          <ReviewList filter={MYPAGE_TAB.MY_REVIEWS} />
        ) : (
          <ReviewList filter={MYPAGE_TAB.MY_REVIEW_FORMS} />
        )}
      </section>
    </div>
  );
}

export default MyPage;
