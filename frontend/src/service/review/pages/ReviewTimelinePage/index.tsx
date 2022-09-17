import { useNavigate } from 'react-router-dom';

import { faArrowTrendUp, faHeart, faPenNib } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';
import {
  useDeleteReviewAnswer,
  useGetReviewPublicAnswer,
} from 'service/@shared/hooks/queries/review';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import Feed from './views/Feed';
import SideMenu from './views/SideMenu';

function ReviewTimelinePage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { mutate: reviewAnswerDelete } = useDeleteReviewAnswer();
  const { isError, isLoading, data: publicReviewAnswer } = useGetReviewPublicAnswer();

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const handleClickEditButton = (reviewFormCode: string, reviewId: number) => () => {
    navigate(
      `${PAGE_LIST.REVIEW}/${reviewFormCode}/${reviewId}?redirect=${encodeURIComponent(
        PAGE_LIST.TIMELINE,
      )}`,
    );
  };

  const handleClickDeleteButton = (reviewId: number) => () => {
    if (!confirm('정말 해당 회고를 삭제하시겠습니까?\n삭제된 회고는 복구할 수 없습니다.')) {
      return;
    }

    reviewAnswerDelete(reviewId, {
      onSuccess: () =>
        showSnackbar({
          title: '회고가 삭제되었습니다.',
          description: '삭제된 회고는 복구할 수 없습니다.',
          theme: 'warning',
        }),

      onError: (error) =>
        showSnackbar({
          title: '회고 삭제에 실패하였습니다.',
          description: error.message,
          theme: 'danger',
        }),
    });
  };

  return (
    <LayoutContainer className={styles.container}>
      <SideMenu>
        <SideMenu.Title>탐색하기</SideMenu.Title>

        <SideMenu.List>
          <SideMenu.Menu icon={faArrowTrendUp}>트랜딩</SideMenu.Menu>
          <SideMenu.Menu icon={faPenNib}>최신글</SideMenu.Menu>
          <SideMenu.Menu icon={faHeart}>구독</SideMenu.Menu>
        </SideMenu.List>

        <SideMenu.Title>나의 구독</SideMenu.Title>
      </SideMenu>

      <Feed>
        <Feed.Title>타임라인</Feed.Title>

        <Feed.List>
          {publicReviewAnswer.map(
            ({ id, reviewFormCode, questions, info: { creator, ...info } }) => (
              <Feed.ReviewAnswer key={id}>
                <Feed.UserProfile
                  socialId={creator.id}
                  profileUrl={creator.profileUrl}
                  nickname={creator.nickname}
                  update={info.updateDate}
                />

                <Questions>
                  <Questions.EditButtons
                    className={styles.questionEdit}
                    isVisible={info.isSelf}
                    onClickEdit={handleClickEditButton(reviewFormCode, id)}
                    onClickDelete={handleClickDeleteButton(id)}
                  />

                  {questions.map(({ answer, ...question }) => (
                    <Questions.Answer
                      key={question.id}
                      question={question.value}
                      description={question.description}
                    >
                      {answer.value}
                    </Questions.Answer>
                  ))}

                  <Questions.Reaction onClickLike={() => null} onClickBookmark={() => null} />
                </Questions>
              </Feed.ReviewAnswer>
            ),
          )}
        </Feed.List>
      </Feed>
    </LayoutContainer>
  );
}

export default ReviewTimelinePage;
