import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { faEraser } from '@fortawesome/free-solid-svg-icons';

import { USER_PROFILE_TAB, PAGE_LIST, MODAL_LIST, PAGE_OPTION } from 'constant';
import { Tabs } from 'types';

import useModal from 'common/hooks/useModal';
import useSnackbar from 'common/hooks/useSnackbar';

import { PaginationBar } from 'common/components';

import { PaginationBarProps } from 'common/components/PaginationBar';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import useProfilePageQueries from './useProfilePageQueries';
import { Controller } from './view/Controller';
import { ItemList } from './view/ItemList';
import { validateTab } from 'service/@shared/validator';

function ProfilePage() {
  const navigate = useNavigate();

  const { socialId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const currentTab = searchParams.get('tab') || USER_PROFILE_TAB.REVIEWS;
  const pageNumber = searchParams.get('page') || String(1);

  validateTab(currentTab);

  const queries = useProfilePageQueries(currentTab as Tabs, socialId, pageNumber);
  if (!queries) return <>{/* Error Boundary, Suspense Used */}</>;

  const {
    userItems,
    userProfile,
    deleteReviewMutation,
    deleteReviewFormMutation,
    deleteTemplateMutation,
  } = queries;

  const subjectTitle = {
    [USER_PROFILE_TAB.REVIEWS]: '작성한 회고',
    [USER_PROFILE_TAB.REVIEW_FORMS]: '생성한 질문지',
    [USER_PROFILE_TAB.TEMPLATES]: '생성한 템플릿',
  };

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

  const deleteSuccessOption = () => {
    showSnackbar({
      icon: faEraser,
      title: `${subjectTitle[currentTab].substring(
        3,
        subjectTitle[currentTab].length,
      )}가(이) 삭제되었습니다.`,
      description: '이제 누구도 해당 회고를 볼 수 없습니다.',
    });
  };

  const handleDeleteReview = (index: number | string) => () => {
    if (
      confirm(
        `정말 ${subjectTitle[currentTab].substring(
          3,
          subjectTitle[currentTab].length,
        )}를(을) 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.`,
      )
    ) {
      if (currentTab === USER_PROFILE_TAB.REVIEWS) {
        deleteReviewMutation.mutate(index as number, {
          onSuccess: deleteSuccessOption,
          onError: ({ message }) => alert(message),
        });
      }
      if (currentTab === USER_PROFILE_TAB.REVIEW_FORMS) {
        deleteReviewFormMutation.mutate(index as string, {
          onSuccess: deleteSuccessOption,
          onError: ({ message }) => alert(message),
        });
      }
      if (currentTab === USER_PROFILE_TAB.TEMPLATES) {
        deleteTemplateMutation.mutate(index as number, {
          onSuccess: deleteSuccessOption,
          onError: ({ message }) => alert(message),
        });
      }
    }
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
          <Controller.TabNavigator currentTab={currentTab as Tabs} onClick={handleChangeTab} />
          <hr className={styles.line} />
          <Controller.Record
            title={subjectTitle[currentTab]}
            numberOfItems={userItems.totalNumber}
          />
        </Controller>

        <ItemList>
          {userItems.itemList.map((item) => (
            <ItemList.Item
              key={item.id || item.reviewFormCode}
              isMine={userItems.isMine}
              item={item}
              titleLink={`${PAGE_LIST.REVIEW_OVERVIEW}/${item.reviewFormCode}`}
              editUrl={`${PAGE_LIST.REVIEW}/${item.reviewFormCode}/${item.id}`}
              onEdit={handleClickEdit}
              onDelete={handleDeleteReview}
            />
          ))}
          <ItemList.NoItemResult totalNumber={userItems.totalNumber}>
            {`${subjectTitle[currentTab]}가(이) 없습니다.`}
          </ItemList.NoItemResult>
          <PaginationBar
            visiblePageButtonLength={
              PAGE_OPTION.REVIEW_BUTTON_LENGTH as PaginationBarProps['visiblePageButtonLength']
            }
            itemCountInPage={PAGE_OPTION.REVIEW_ITEM_SIZE}
            totalItemCount={userItems.totalNumber}
            focusedPage={Number(pageNumber)}
            onClickPageButton={movePage}
          />
        </ItemList>
      </LayoutContainer>
    </>
  );
}

export default ProfilePage;
