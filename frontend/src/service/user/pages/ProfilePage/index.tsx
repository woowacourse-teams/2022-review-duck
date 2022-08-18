import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import cn from 'classnames';

import { Button, Icon, Text } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import ReviewList from './containers/ReviewList';
import useProfilePageQueries from './useProfilePageQueries';
import { USER_PROFILE_TAB, GITHUB_PROFILE_URL, PAGE_LIST } from 'service/@shared/constants';

function ProfilePage() {
  const navigate = useNavigate();

  const { socialId = '' } = useParams();
  const [searchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || USER_PROFILE_TAB.REVIEWS;

  const { myReviews, myReviewForms, userProfile, isError, error } = useProfilePageQueries(socialId);

  useEffect(() => {
    if (isError) {
      alert(error?.message);
    }
  }, [isError, error]);

  const onChangeTab = (filter: string) => () => {
    navigate(`${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${filter}`);
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
              {userProfile.socialNickname}
            </Text>
          </div>

          <div className={styles.profileManage}>
            <Button size="small">
              <Icon code="edit_note" />
              <span>Edit</span>
            </Button>

            <a
              href={`${GITHUB_PROFILE_URL}${userProfile.socialNickname}`}
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
              className={cn(styles.item, {
                [styles.focus]: currentTab === USER_PROFILE_TAB.REVIEWS,
              })}
              onClick={onChangeTab(USER_PROFILE_TAB.REVIEWS)}
            >
              작성한 회고글
            </li>
            <li
              className={cn(styles.item, {
                [styles.focus]: currentTab === USER_PROFILE_TAB.REVIEW_FORMS,
              })}
              onClick={onChangeTab(USER_PROFILE_TAB.REVIEW_FORMS)}
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
          <ReviewList socialId={socialId} filter={currentTab} />
        </div>
      </LayoutContainer>
    </>
  );
}

export default ProfilePage;
