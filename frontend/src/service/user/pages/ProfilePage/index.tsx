import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { faEraser } from '@fortawesome/free-solid-svg-icons';

import { USER_PROFILE_TAB, PAGE_LIST, MODAL_LIST, PAGE_OPTION } from 'constant';

import useModal from 'common/hooks/useModal';
import useSnackbar from 'common/hooks/useSnackbar';

import { PaginationBar } from 'common/components';

import { PaginationBarProps } from 'common/components/PaginationBar';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import useProfilePageQueries from './useProfilePageQueries';
import { Controller } from './view/Controller';
import { ItemList } from './view/ItemList';

function ProfilePage() {
  const navigate = useNavigate();

  const { socialId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const currentTab = searchParams.get('tab') || USER_PROFILE_TAB.REVIEWS;
  const pageNumber = searchParams.get('page') || String(1);

  const queries = useProfilePageQueries(currentTab, socialId, pageNumber);

  if (!queries) return <></>;

  const {
    userReviews,
    userReviewForms,
    userTemplates,
    userProfile,
    deleteReviewMutation,
    deleteReviewFormMutation,
    deleteTemplateMutation,
  } = queries;

  const handleChangeTab = (filter: string) => () => {
    navigate(`${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${filter}`);
  };

  const handleEditProfile = () => {
    showModal(MODAL_LIST.PROFILE_EDIT);
  };

  const movePage = (pageNumber: number) => {
    setSearchParams({ tab: currentTab, page: String(pageNumber) });
    window.scrollTo(0, 0);
  };

  const handleClickEdit = (editLink: string) => () => {
    navigate(editLink);
  };

  const handleDeleteReview = (reviewId: number | string) => () => {
    if (confirm('정말 회고를 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteReviewMutation.mutate(reviewId as number, {
        onSuccess: () => {
          showSnackbar({
            icon: faEraser,
            title: '작성한 회고가 삭제되었습니다.',
            description: '이제 누구도 해당 회고를 볼 수 없습니다.',
          });
        },
        onError: ({ message }) => {
          alert(message);
        },
      });
    }
  };

  const handleDeleteReviewForm = (reviewFormCode: string | number) => () => {
    if (confirm('정말 회고를 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteReviewFormMutation.mutate(reviewFormCode as string, {
        onSuccess: () => {
          showSnackbar({
            icon: faEraser,
            title: '생성한 회고가 삭제되었습니다.',
            description: '이제 누구도 해당 회고를 볼 수 없습니다.',
          });
        },
        onError: ({ message }) => {
          alert(message);
        },
      });
    }
  };

  const handleDeleteTemplate = (templateId: number | string) => () => {
    if (confirm('정말 회고를 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteTemplateMutation.mutate(templateId as number, {
        onSuccess: () => {
          showSnackbar({
            icon: faEraser,
            title: '생성한 회고가 삭제되었습니다.',
            description: '이제 누구도 해당 회고를 볼 수 없습니다.',
          });
        },
        onError: ({ message }) => {
          alert(message);
        },
      });
    }
  };

  const getTotalItemCount = () => {
    if (currentTab === USER_PROFILE_TAB.REVIEWS) return userReviews.totalNumber;
    if (currentTab === USER_PROFILE_TAB.REVIEW_FORMS) return userReviewForms.totalNumber;
    return userTemplates.totalNumber;
  };

  return (
    <>
      <div
        className={styles.profileBackground}
        style={{ backgroundImage: `url(${userProfile.profileUrl})` }}
      />

      <LayoutContainer className={styles.container}>
        <Controller>
          <Controller.Profile profileUrl={userProfile.profileUrl} />
          <Controller.NameCard
            nickname={userProfile.nickname}
            socialNickname={userProfile.socialNickname}
          />
          <Controller.ProfileManager
            isMyProfile={userProfile.isMine}
            socialNickname={userProfile.socialNickname}
            onClick={handleEditProfile}
          />
          <hr className={styles.line} />
          <Controller.TabNavigator currentTab={currentTab} onClick={handleChangeTab} />
          <hr className={styles.line} />
          <Controller.Record
            numberOfReviews={userReviews.totalNumber}
            numberOfReviewForms={userReviewForms.totalNumber}
            numberOfTemplates={userTemplates.totalNumber}
          />
        </Controller>

        <ItemList>
          {currentTab === USER_PROFILE_TAB.REVIEWS && (
            <>
              {userReviews.itemList.map((item) => (
                <ItemList.Item
                  key={item.id}
                  isMine={userReviews.isMine}
                  item={item}
                  titleLink={`${PAGE_LIST.REVIEW_OVERVIEW}/${item.reviewFormCode}`}
                  editUrl={`${PAGE_LIST.REVIEW}/${item.reviewFormCode}/${item.id}`}
                  onEdit={handleClickEdit}
                  onDelete={handleDeleteReview}
                />
              ))}
              <ItemList.NoItemResult totalNumber={userReviews.totalNumber}>
                작성한 회고가 없습니다.
              </ItemList.NoItemResult>
            </>
          )}
          {currentTab === USER_PROFILE_TAB.REVIEW_FORMS && (
            <>
              {userReviewForms.itemList.map((item) => (
                <ItemList.Item
                  key={item.reviewFormCode}
                  isMine={userReviewForms.isMine}
                  item={item}
                  titleLink={`${PAGE_LIST.REVIEW_OVERVIEW}/${item.reviewFormCode}`}
                  editUrl={`${PAGE_LIST.REVIEW_FORM}/${
                    item.reviewFormCode
                  }?redirect=${encodeURIComponent(
                    `${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${USER_PROFILE_TAB.REVIEW_FORMS}`,
                  )}`}
                  onEdit={handleClickEdit}
                  onDelete={handleDeleteReviewForm}
                />
              ))}
              <ItemList.NoItemResult totalNumber={userReviewForms.totalNumber}>
                생성한 회고가 없습니다.
              </ItemList.NoItemResult>
            </>
          )}
          {currentTab === USER_PROFILE_TAB.TEMPLATES && (
            <>
              {userTemplates.itemList.map((item) => (
                <ItemList.Item
                  key={item.id}
                  isMine={userTemplates.isMine}
                  item={item}
                  titleLink={`${PAGE_LIST.TEMPLATE_DETAIL}/${item.id}`}
                  editUrl={`${PAGE_LIST.TEMPLATE_FORM}?templateId=${
                    item.id
                  }&templateEditMode=true&redirect=${encodeURIComponent(
                    `${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${USER_PROFILE_TAB.TEMPLATES}`,
                  )}`}
                  onEdit={handleClickEdit}
                  onDelete={handleDeleteTemplate}
                />
              ))}
              <ItemList.NoItemResult totalNumber={userTemplates.totalNumber}>
                생성한 템플릿이 없습니다.
              </ItemList.NoItemResult>
            </>
          )}
          <PaginationBar
            visiblePageButtonLength={
              PAGE_OPTION.REVIEW_BUTTON_LENGTH as PaginationBarProps['visiblePageButtonLength']
            }
            itemCountInPage={PAGE_OPTION.REVIEW_ITEM_SIZE}
            totalItemCount={getTotalItemCount()}
            focusedPage={Number(pageNumber)}
            onClickPageButton={movePage}
          />
        </ItemList>
      </LayoutContainer>
    </>
  );
}

export default ProfilePage;
