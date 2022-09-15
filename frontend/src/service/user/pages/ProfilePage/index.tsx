import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import cn from 'classnames';
import { USER_PROFILE_TAB, GITHUB_PROFILE_URL, PAGE_LIST, MODAL_LIST, PAGE_OPTION } from 'constant';

import useModal from 'common/hooks/useModal';

import { Button, Icon, PaginationBar, Text } from 'common/components';

import { PaginationBarProps } from 'common/components/PaginationBar';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import ReviewList from './containers/ReviewList';
import useProfilePageQueries from './useProfilePageQueries';

function ProfilePage() {
  const navigate = useNavigate();

  const { socialId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showModal } = useModal();

  const currentTab = searchParams.get('tab') || USER_PROFILE_TAB.REVIEWS;
  const pageNumber = searchParams.get('page') || String(1);

  const { userReviews, userReviewForms, userProfile, isError, error } = useProfilePageQueries(
    socialId,
    pageNumber,
  );

  useEffect(() => {
    if (isError) {
      alert(error?.message);
    }
  }, [isError, error]);

  const onChangeTab = (filter: string) => () => {
    navigate(`${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${filter}`);
  };

  const handleEditProfile = () => {
    showModal(MODAL_LIST.PROFILE_EDIT);
  };

  const movePage = (pageNumber: number) => {
    setSearchParams({ tab: currentTab, page: String(pageNumber) });
    window.scrollTo(0, 0);
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
            {userProfile.isMine && (
              <Button size="small" onClick={handleEditProfile}>
                <Icon code="edit_note" />
                <span>Edit</span>
              </Button>
            )}

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
                {userReviews.numberOfReviews}
              </Text>
              <Text size={12}>회고 작성</Text>
            </div>
            <div className={styles.counter}>
              <Text className={styles.number} size={24} weight="bold">
                {userReviewForms.numberOfReviewForms}
              </Text>
              <Text size={12}>생성</Text>
            </div>
          </div>
        </aside>

        <div className={styles.mainContent}>
          <ReviewList socialId={socialId} filter={currentTab} pageNumber={pageNumber} />
          <PaginationBar
            visiblePageButtonLength={
              PAGE_OPTION.REVIEW_BUTTON_LENGTH as PaginationBarProps['visiblePageButtonLength']
            }
            itemCountInPage={PAGE_OPTION.REVIEW_ITEM_SIZE}
            totalItemCount={
              currentTab === USER_PROFILE_TAB.REVIEWS
                ? userReviews.numberOfReviews
                : userReviewForms.numberOfReviewForms
            }
            focusedPage={Number(pageNumber)}
            onClickPageButton={movePage}
          />
        </div>
      </LayoutContainer>
    </>
  );
}

export default ProfilePage;
