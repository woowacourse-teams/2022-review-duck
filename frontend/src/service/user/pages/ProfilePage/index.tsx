import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { faEraser } from '@fortawesome/free-solid-svg-icons';

import { FILTER, PAGE_LIST, MODAL_LIST, PAGE_OPTION } from 'constant';
import { Tabs } from 'types';

import useModal from 'common/hooks/useModal';
import useSnackbar from 'common/hooks/useSnackbar';

import { PaginationBar } from 'common/components';

import { PaginationBarProps } from 'common/components/PaginationBar';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import useProfilePageQueries from './useProfilePageQueries';
import { ArticleList } from './view/ArticleList';
import { Controller } from './view/Controller';
import { validateFilter } from 'service/@shared/validator';

function ProfilePage() {
  const navigate = useNavigate();

  const { socialId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const currentTab = searchParams.get('tab') || FILTER.USER_PROFILE_TAB.REVIEWS;
  const pageNumber = searchParams.get('page') || String(1);

  validateFilter(
    [
      FILTER.USER_PROFILE_TAB.REVIEWS,
      FILTER.USER_PROFILE_TAB.REVIEW_FORMS,
      FILTER.USER_PROFILE_TAB.TEMPLATES,
    ],
    currentTab,
  );

  const queries = useProfilePageQueries(currentTab as Tabs, socialId, pageNumber);
  if (!queries) return <>{/* Error Boundary, Suspense Used */}</>;

  const {
    userArticles,
    userProfile,
    deleteReviewMutation,
    deleteReviewFormMutation,
    deleteTemplateMutation,
  } = queries;

  const subjectTitle = {
    [FILTER.USER_PROFILE_TAB.REVIEWS]: '작성한 회고',
    [FILTER.USER_PROFILE_TAB.REVIEW_FORMS]: '생성한 질문지',
    [FILTER.USER_PROFILE_TAB.TEMPLATES]: '생성한 템플릿',
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

  const handleClickEdit = (id?: number, code?: string, socialId?: string) => () => {
    switch (currentTab) {
      case FILTER.USER_PROFILE_TAB.REVIEWS:
        navigate(
          `${PAGE_LIST.REVIEW}/${code}/${id}?redirect=${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${currentTab}`,
        );
        break;

      case FILTER.USER_PROFILE_TAB.REVIEW_FORMS:
        navigate(
          `${PAGE_LIST.REVIEW_FORM}/${code}?redirect=${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${currentTab}`,
        );
        break;

      case FILTER.USER_PROFILE_TAB.TEMPLATES:
        navigate(`${PAGE_LIST.TEMPLATE_FORM}?templateId=${id}&templateEditMode=true`);
        break;
    }
  };

  const deleteSuccessOption = () => {
    showSnackbar({
      icon: faEraser,
      title: `${subjectTitle[currentTab].substring(
        3,
        subjectTitle[currentTab].length,
      )}가(이) 삭제되었습니다.`,
      description: '더 이상 조회할 수 없으며, 삭제된 정보는 복구할 수 없습니다.',
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
      if (currentTab === FILTER.USER_PROFILE_TAB.REVIEWS) {
        deleteReviewMutation.mutate(index as number, {
          onSuccess: deleteSuccessOption,
          onError: ({ message }) => alert(message),
        });
      }
      if (currentTab === FILTER.USER_PROFILE_TAB.REVIEW_FORMS) {
        deleteReviewFormMutation.mutate(index as string, {
          onSuccess: deleteSuccessOption,
          onError: ({ message }) => alert(message),
        });
      }
      if (currentTab === FILTER.USER_PROFILE_TAB.TEMPLATES) {
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
            onEditButtonClick={handleEditProfile}
          />
          <hr className={styles.line} />
          <Controller.TabNavigator currentTab={currentTab as Tabs} onTabClick={handleChangeTab} />
          <hr className={styles.line} />
          <Controller.Record
            title={subjectTitle[currentTab]}
            numberOfItems={userArticles.totalNumber}
          />
        </Controller>

        <ArticleList>
          {userArticles.articleList.map((article) => (
            <div className={styles.reviewContainer} key={article.id || article.reviewFormCode}>
              <Questions>
                <Link
                  to={
                    currentTab === FILTER.USER_PROFILE_TAB.TEMPLATES
                      ? `${PAGE_LIST.TEMPLATE_DETAIL}/${article.id}`
                      : `${PAGE_LIST.REVIEW_OVERVIEW}/${article.reviewFormCode}`
                  }
                >
                  <Questions.Title>{article.title}</Questions.Title>
                </Link>
                <Questions.EditButtons
                  isVisible={userArticles.isMine}
                  onClickEdit={handleClickEdit(
                    article.id,
                    article.reviewFormCode,
                    userProfile.socialId,
                  )}
                  onClickDelete={handleDeleteReview(article.id || article.reviewFormCode || '')}
                />
                {article.contents.map((content) => (
                  <Questions.Answer
                    key={content.question.id}
                    question={content.question.value}
                    description={content.question.description}
                  >
                    {content.answer?.value}
                  </Questions.Answer>
                ))}
                <Questions.Reaction
                  likeCount={0}
                  onClickLike={() => null}
                  onClickBookmark={() => null}
                />
              </Questions>
            </div>
          ))}
          <ArticleList.NoArticleResult totalNumber={userArticles.totalNumber}>
            {`${subjectTitle[currentTab]}가(이) 없습니다.`}
          </ArticleList.NoArticleResult>
          <PaginationBar
            visiblePageButtonLength={
              PAGE_OPTION.REVIEW_BUTTON_LENGTH as PaginationBarProps['visiblePageButtonLength']
            }
            itemCountInPage={PAGE_OPTION.REVIEW_ITEM_SIZE}
            totalItemCount={userArticles.totalNumber}
            focusedPage={Number(pageNumber)}
            onClickPageButton={movePage}
          />
        </ArticleList>
      </LayoutContainer>
    </>
  );
}

export default ProfilePage;
