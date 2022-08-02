import { useState } from 'react';

import cn from 'classnames';

import { Button, Icon, Text } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import imageRuna from 'assets/images/compy.png';

import styles from './styles.module.scss';

import ReviewList from './containers/ReviewList';
import { TAB } from 'service/@shared/constants';

const user = {
  profileUrl: 'hello',
  githubNickname: 'lunatic',
  githubStatus: 'world',
  nickname: '루나',
  numberOfReviews: 12,
  numberOfRevieForms: 4,
};

function MyPage() {
  const [currentTab, setCurrentTab] = useState(TAB.MY_REVIEWS);
  /* TODO: 사용자 관련 정보 API 요청 */

  return (
    <>
      <div className={styles.profileBackground} style={{ backgroundImage: `url(${imageRuna})` }} />

      <LayoutContainer className={styles.container}>
        <aside className={styles.sideContent}>
          <div className={styles.profileImage} style={{ backgroundImage: `url(${imageRuna})` }}>
            <div className={styles.activeIcon}>🦖</div>
          </div>

          <div className={styles.nameCard}>
            <Text size={24} weight="bold">
              Ryu Hyun Seung
            </Text>

            <Text size={14} weight="lighter">
              compy-ryu
            </Text>
          </div>

          <div className={styles.profileManage}>
            <Button size="small">
              <Icon code="edit_note" />
              <span>Edit</span>
            </Button>

            <Button size="small" theme="outlined">
              <Icon code="person" />
              <span>Github Profile</span>
            </Button>
          </div>

          <hr className={styles.line} />

          <ul className={styles.sideMenu}>
            <Text className={styles.title} size={14}>
              회고 목록
            </Text>

            <li className={cn(styles.item, styles.focus)}>작성한 회고글</li>
            <li className={styles.item}>생성한 회고</li>
          </ul>

          <hr className={styles.line} />

          <div className={styles.counterContainer}>
            <div className={styles.counter}>
              <Text className={styles.number} size={24} weight="bold">
                32
              </Text>
              <Text size={12}>회고 작성</Text>
            </div>
            <div className={styles.counter}>
              <Text className={styles.number} size={24} weight="bold">
                7
              </Text>
              <Text size={12}>생성</Text>
            </div>
          </div>
        </aside>

        <div className={styles.mainContent}>
          {currentTab === TAB.MY_REVIEWS ? (
            <ReviewList filter={TAB.MY_REVIEWS} />
          ) : (
            <ReviewList filter={TAB.MY_REVIEW_FORMS} />
          )}
        </div>
      </LayoutContainer>
    </>
  );
}

export default MyPage;
