import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { updateReviewLike } from 'api/review.api';

import useSnackbar from 'common/hooks/useSnackbar';

import { FlexContainer, PaginationBar } from 'common/components';
import PageSuspense from 'common/components/PageSuspense';
import { PaginationBarProps } from 'common/components/PaginationBar';
import LayoutContainer from 'service/components/LayoutContainer';
import useModal from 'service/components/ModalProvider/useModal';
import Questions from 'service/components/Questions';

import { FILTER, PAGE_LIST, MODAL_LIST, PAGE_OPTION } from 'constant';
import { isInclude } from 'utils';
import { isNumberString } from 'utils/validator';

import useProfilePage from './useProfilePage';
import ArticleList from './view/ArticleList';
import Controller from './view/Controller';

import styles from './styles.module.scss';

function UserProfilePage() {
  const navigate = useNavigate();
  const { socialId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = useModal();
  const snackbar = useSnackbar();

  const currentTabParam = searchParams.get('tab');
  const currentTab = isInclude(Object.values(FILTER.USER_PROFILE_TAB), currentTabParam)
    ? currentTabParam
    : FILTER.USER_PROFILE_TAB.REVIEWS;

  const pageNumber =
    isNumberString(searchParams.get(FILTER.PAGE)) && Number(searchParams.get(FILTER.PAGE)) > 0
      ? Number(searchParams.get(FILTER.PAGE))
      : 1;

  const pageQueries = useProfilePage(currentTab, socialId, pageNumber);

  if (!pageQueries) return <>{/* Error Boundary, Suspense Used */}</>;

  const {
    reviewMutations,
    templateMutations,
    articles,
    articlesLikeStack,
    articlesPages,
    articlesOptimisticUpdater,
    userProfile,
    addFetch,
  } = pageQueries;

  const subjectTitle = {
    [FILTER.USER_PROFILE_TAB.REVIEWS]: '작성한 회고',
    [FILTER.USER_PROFILE_TAB.REVIEW_FORMS]: '생성한 질문지',
    [FILTER.USER_PROFILE_TAB.TEMPLATES]: '생성한 템플릿',
  };

  const handleChangeTab = (filter: string) => () => {
    navigate(`${PAGE_LIST.USER_PROFILE}/${socialId}?tab=${filter}`);
  };

  const handleEditProfile = () => {
    modal.show({ key: MODAL_LIST.PROFILE_EDIT });
  };

  const handlePagination = (pageNumber: number, replace = false) => {
    setSearchParams({ tab: currentTab, page: String(pageNumber) }, { replace });
  };

  const handlePageError = () => {
    const totalPageLength = Math.ceil(articlesPages.totalNumber / PAGE_OPTION.REVIEW_ITEM_SIZE);

    const redirectReplace = true;

    if (pageNumber > totalPageLength) {
      handlePagination(totalPageLength, redirectReplace);
    }
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
        navigate(`${PAGE_LIST.TEMPLATE_FORM}/${id}`);
        break;
    }
  };

  const handleSuccessRemoveMessage = () => {
    snackbar.show({
      icon: faTrash,
      title: '삭제 처리 되었습니다.',
      description: '삭제된 정보는 복구할 수 없습니다.',
      theme: 'warning',
    });
  };

  const handleDeleteReview = (targetID: number | string) => () => {
    if (confirm(`정말 삭제하시겠습니까?\n삭제 후 복구를 할 수 없습니다.`)) {
      if (currentTab === FILTER.USER_PROFILE_TAB.REVIEWS) {
        reviewMutations.removeAnswer.mutate(targetID as number, {
          onSuccess: handleSuccessRemoveMessage,
          onError: ({ message }) => alert(message),
        });
      }
      if (currentTab === FILTER.USER_PROFILE_TAB.REVIEW_FORMS) {
        reviewMutations.removeForm.mutate(String(targetID), {
          onSuccess: handleSuccessRemoveMessage,
          onError: ({ message }) => alert(message),
        });
      }
      if (currentTab === FILTER.USER_PROFILE_TAB.TEMPLATES) {
        templateMutations.remove.mutate(targetID as number, {
          onSuccess: handleSuccessRemoveMessage,
          onError: ({ message }) => alert(message),
        });
      }
    }
  };

  const handleClickLikeButton =
    (reviewId: number | null = null, likes = 0) =>
    () => {
      if (!reviewId) return;

      if (!articlesLikeStack.current[reviewId]) {
        articlesLikeStack.current[reviewId] = 0;
      }

      const reviewLikeStack = (articlesLikeStack.current[reviewId] += 1);

      addFetch(reviewId, () => updateReviewLike({ reviewId, likes: reviewLikeStack }), {
        onUpdate: () => articlesOptimisticUpdater.basedOnKey('id', reviewId, { likes: likes + 1 }),
        onError: (error) => {
          articlesOptimisticUpdater.rollback();
          snackbar.show({
            theme: 'danger',
            title: '회고 좋아요에 실패하였습니다.',
            description: error.message,
          });
        },
        onSuccess: ({ likes: latestLikes }) => {
          articlesOptimisticUpdater.basedOnKey('id', reviewId, { likes: latestLikes });
          delete articlesLikeStack.current[reviewId];
        },
      });
    };

  return PageSuspense(
    <div className={styles.pageProfile}>
      <div
        className={styles.profileBackground}
        style={{ backgroundImage: `url(${userProfile.profileUrl})` }}
      />

      <LayoutContainer className={styles.container}>
        <Controller>
          <Controller.Profile
            profileUrl={userProfile.profileUrl}
            nickname={userProfile.nickname}
            socialNickname={userProfile.socialNickname}
          />

          <Controller.ProfileManager
            isMyProfile={userProfile.isMine}
            socialNickname={userProfile.socialNickname}
            onEditButtonClick={handleEditProfile}
          />

          <hr className={styles.line} />

          <Controller.TabNavigator currentTab={currentTab} onTabClick={handleChangeTab} />

          <hr className={styles.line} />

          <Controller.Record
            title={subjectTitle[currentTab]}
            numberOfItems={articlesPages.totalNumber}
          />
        </Controller>

        <ArticleList>
          {articles.map((article) => (
            <div className={styles.reviewContainer} key={article.id || article.reviewFormCode}>
              <Questions>
                <Link
                  to={
                    currentTab === FILTER.USER_PROFILE_TAB.TEMPLATES
                      ? `${PAGE_LIST.TEMPLATE_DETAIL}/${article.id}`
                      : `${PAGE_LIST.REVIEW_OVERVIEW}/${article.reviewFormCode}`
                  }
                >
                  <Questions.Title lockIcon={article.isPrivate} subtitle={article.reviewTitle}>
                    {article.title}
                  </Questions.Title>
                </Link>

                <Questions.EditButtons
                  isVisible={articlesPages.isMine}
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

                {currentTab === FILTER.USER_PROFILE_TAB.REVIEWS && (
                  <FlexContainer direction="row" justify="space-between">
                    <Questions.Reaction
                      likeCount={article.likes || 0}
                      onClickLike={handleClickLikeButton(article?.id, article?.likes)}
                      onClickBookmark={() => null}
                    />
                    <Questions.UpdatedTime>{article.updatedAt}</Questions.UpdatedTime>
                  </FlexContainer>
                )}

                {currentTab !== FILTER.USER_PROFILE_TAB.REVIEWS && (
                  <Questions.UpdatedTime>{article.updatedAt}</Questions.UpdatedTime>
                )}
              </Questions>
            </div>
          ))}

          <ArticleList.NoArticleResult totalNumber={articles.length}>
            {`${subjectTitle[currentTab]}가(이) 없습니다.`}
          </ArticleList.NoArticleResult>

          {articlesPages.totalNumber !== 0 && (
            <PaginationBar
              visiblePageButtonLength={
                PAGE_OPTION.REVIEW_BUTTON_LENGTH as PaginationBarProps['visiblePageButtonLength']
              }
              itemCountInPage={PAGE_OPTION.REVIEW_ITEM_SIZE}
              totalItemCount={articlesPages.totalNumber}
              focusedPage={Number(pageNumber)}
              onClickPageButton={handlePagination}
              onPageError={handlePageError}
            />
          )}
        </ArticleList>
      </LayoutContainer>
    </div>,
  );
}

export default UserProfilePage;
