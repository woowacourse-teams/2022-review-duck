import { useNavigate, useParams } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';
import {
  useDeleteReviewAnswer,
  useGetReviewForm,
  useGetReviewFormAnswer,
} from 'service/@shared/hooks/queries/review';

import { FlexContainer, Skeleton } from 'common/components';

import Profile from 'service/@shared/components/Profile';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import { Header } from './views/Header';
import { ListView } from './views/ListView';
import { SheetView } from './views/SheetView';
import { PAGE_LIST } from 'service/@shared/constants';

/*
  TODO:
  - 페이지 비즈니스 로직 & API 통신 처리 커스텀훅 분리
  - ListView => ReviewList, SideMenu로 나누기
  - 시트뷰 / 리스트뷰 출력 방식 조금 더 보기 좋게 구조 개선
*/

function ReviewOverViewPage() {
  const navigate = useNavigate();
  const { reviewFormCode = '', displayMode = 'list' } = useParams();

  const { showSnackbar } = useSnackbar();

  const reviewFormAnswerQuery = useGetReviewFormAnswer(
    { reviewFormCode, display: displayMode },
    {
      suspense: false,
    },
  );

  const reviewFormQuery = useGetReviewForm(reviewFormCode, {
    suspense: false,
  });

  const { mutate } = useDeleteReviewAnswer();

  const reviewForm = reviewFormQuery.data;
  const reviewAnswers = reviewFormAnswerQuery.data;

  const isContentLoaded = reviewFormQuery.isSuccess && reviewFormAnswerQuery.isSuccess;

  const membersUniqueFilter = [
    ...new Map(reviewAnswers?.map(({ info: { creator } }) => [creator.id, creator])),
  ];

  const handleEditAnswer = (reviewId: number) => () => {
    navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}/${reviewId}`);
  };

  const handleDeleteAnswer = (reviewId: number) => () => {
    if (!confirm('정말 해당 회고를 삭제하시겠습니까?')) return;

    mutate(reviewId, {
      onSuccess: () => {
        showSnackbar({
          title: '작성한 회고가 삭제되었습니다.',
          description: '더 이상 조회할 수 없으며, 삭제된 정보는 복구할 수 없습니다.',
          theme: 'danger',
        });
      },
    });
  };

  return (
    <div className={styles.layout}>
      <Header>
        <Header.FormInformation isLoading={!isContentLoaded} fallback={<Skeleton />}>
          <Header.Title>{reviewForm?.title}</Header.Title>
          <Header.Description>크리에이터 : {reviewForm?.info.creator.nickname}</Header.Description>
        </Header.FormInformation>

        <Header.ViewChangeButtons displayMode={displayMode} reviewFormCode={reviewFormCode} />
      </Header>

      {displayMode !== 'sheet' ? (
        <ListView>
          <ListView.Content isLoading={!isContentLoaded} fallback={<Skeleton line={4} />}>
            <ListView.ParticipantList>
              {membersUniqueFilter?.map(
                ([key, creator]) =>
                  key && (
                    <Profile key={key} className={styles.profile} textAlign="center" align="center">
                      <Profile.Image size="large" edge="pointed" src={creator.profileUrl} />
                      <Profile.Nickname size={14}>{creator.nickname}</Profile.Nickname>
                      <Profile.Description size={12}></Profile.Description>
                    </Profile>
                  ),
              )}
            </ListView.ParticipantList>

            {isContentLoaded &&
              reviewAnswers?.map(({ id, info, questions }) => (
                <ListView.Review key={id}>
                  <Questions>
                    <Questions.CoverProfile
                      image={info.creator.profileUrl}
                      title={info.creator.nickname}
                      description={info.updateDate}
                    />

                    <Questions.EditButtons
                      isVisible={info.isSelf}
                      onClickEdit={handleEditAnswer(id)}
                      onClickDelete={handleDeleteAnswer(id)}
                    ></Questions.EditButtons>

                    {questions.map(({ description, answer, ...question }, index) => (
                      <Questions.Answer
                        key={question.id}
                        question={`${index + 1}. ${question.value}`}
                        description={description}
                      >
                        {answer.value}
                      </Questions.Answer>
                    ))}

                    <Questions.Reaction onClickLike={() => null} onClickBookmark={() => null} />
                  </Questions>
                </ListView.Review>
              ))}
          </ListView.Content>

          <ListView.SideMenu isLoading={!isContentLoaded} fallback={<Skeleton line={3} />}>
            <ListView.FormDetail>
              <FlexContainer gap="small">
                <ListView.InfoText name="크리에이터">
                  {reviewForm?.info.creator.nickname}
                </ListView.InfoText>
                <ListView.InfoText name="회고 참여자">
                  총 {membersUniqueFilter.length}명이 참여함
                </ListView.InfoText>
                <ListView.InfoText name="업데이트">{reviewForm?.info.updateDate}</ListView.InfoText>
              </FlexContainer>

              <ListView.JoinButton reviewFormCode={reviewFormCode} />

              <ListView.FormCopyLink reviewFormCode={reviewFormCode} />

              <ListView.FormManageButtons reviewFormCode={reviewFormCode} />
            </ListView.FormDetail>
          </ListView.SideMenu>
        </ListView>
      ) : (
        <SheetView>
          <SheetView.Questions>
            {isContentLoaded &&
              reviewForm?.questions.map((question) => (
                <SheetView.Item key={question.id} isTitle>
                  {question.value}
                </SheetView.Item>
              ))}
          </SheetView.Questions>

          <SheetView.ReviewList>
            {isContentLoaded &&
              reviewAnswers?.map(({ id, info: { creator }, questions }) => (
                <SheetView.Answers key={id}>
                  <SheetView.Creator
                    nickname={creator.nickname}
                    profileImage={creator.profileUrl}
                  />

                  {questions.map(({ answer, ...review }) => (
                    <SheetView.Item key={review.id}>{answer && answer.value}</SheetView.Item>
                  ))}
                </SheetView.Answers>
              ))}
          </SheetView.ReviewList>
        </SheetView>
      )}
    </div>
  );
}

export default ReviewOverViewPage;
