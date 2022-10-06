import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FILTER, PAGE_LIST, PAGE_OPTION } from 'constant';
import { DisplayModeType, ReviewFormAnswerList } from 'types';

import useIntersectionObserver from 'common/hooks/useIntersectionObserver';
import useSnackbar from 'common/hooks/useSnackbar';
import {
  useDeleteReviewAnswer,
  useGetInfiniteReviewFormAnswer,
  useGetReviewForm,
} from 'service/@shared/hooks/queries/review';

import { FlexContainer, Skeleton } from 'common/components';

import Profile from 'service/@shared/components/Profile';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import { Header } from './view/Header';
import { ListView } from './view/ListView';
import { SheetView } from './view/SheetView';
import { validateFilter } from 'service/@shared/validator';

/*
  TODO:
  - 페이지 비즈니스 로직 & API 통신 처리 커스텀훅 분리
  - ListView => ReviewList, SideMenu로 나누기
  - 시트뷰 / 리스트뷰 출력 방식 조금 더 보기 좋게 구조 개선
*/

function ReviewOverViewPage() {
  const navigate = useNavigate();
  const { reviewFormCode = '', displayMode = FILTER.DISPLAY_MODE.LIST } = useParams();

  useEffect(function queryStringFilter() {
    validateFilter([FILTER.DISPLAY_MODE.LIST, FILTER.DISPLAY_MODE.SHEET], displayMode);
  }, []);

  const { showSnackbar } = useSnackbar();

  const {
    data: reviewAnswers,
    fetchNextPage,
    isFetching,
    isError: isAnswerError,
    isLoading: isAnswerLoading,
  } = useGetInfiniteReviewFormAnswer(reviewFormCode, displayMode as DisplayModeType);

  const { data: reviewForm, isLoading: isFormLoading } = useGetReviewForm(reviewFormCode, {
    suspense: false,
  });

  const { targetRef } = useIntersectionObserver<
    ReviewFormAnswerList,
    HTMLElement & HTMLTableRowElement
  >(fetchNextPage, { threshold: 0.75 }, [reviewAnswers, reviewForm]);

  const { mutate } = useDeleteReviewAnswer();

  if (isAnswerError || isAnswerLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { pages } = reviewAnswers;

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
        <Header.FormInformation isLoading={isFormLoading} fallback={<Skeleton />}>
          <Header.Title>{reviewForm?.title}</Header.Title>
          <Header.Description>크리에이터 : {reviewForm?.info.creator.nickname}</Header.Description>
        </Header.FormInformation>

        <Header.ViewChangeButtons displayMode={displayMode} reviewFormCode={reviewFormCode} />
      </Header>

      {displayMode === FILTER.DISPLAY_MODE.LIST ? (
        <ListView>
          <ListView.Content isLoading={isFormLoading} fallback={<Skeleton line={4} />}>
            <ListView.ParticipantList>
              {reviewForm?.participants?.map((user) => (
                <Profile
                  key={user.id}
                  className={styles.profile}
                  socialId={user.id}
                  textAlign="center"
                  align="center"
                >
                  <Profile.Image size="large" edge="pointed" src={user.profileUrl} />
                  <Profile.Nickname size={14}>{user.nickname}</Profile.Nickname>
                  <Profile.Description size={12}></Profile.Description>
                </Profile>
              ))}
            </ListView.ParticipantList>

            {pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.reviews.map(({ id, info, questions }, index) => (
                  <ListView.Review
                    key={id}
                    // ref={index === PAGE_OPTION.REVIEW_ITEM_SIZE - 1 ? targetRef : null}
                  >
                    <Questions>
                      <Questions.CoverProfile
                        socialId={info.creator.id}
                        image={info.creator.profileUrl}
                        title={info.reviewTitle as string}
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

                      <Questions.Reaction
                        likeCount={0}
                        onClickLike={() => null}
                        onClickBookmark={() => null}
                      />
                    </Questions>
                  </ListView.Review>
                ))}
              </React.Fragment>
            ))}
            <div ref={targetRef} />
            {isFetching && <ListView.Loading line={PAGE_OPTION.REVIEW_ITEM_SIZE} />}
          </ListView.Content>

          <ListView.SideMenu isLoading={isFormLoading} fallback={<Skeleton line={3} />}>
            <ListView.FormDetail>
              <FlexContainer gap="small">
                <ListView.InfoText name="크리에이터">
                  {reviewForm?.info.creator.nickname}
                </ListView.InfoText>
                <ListView.InfoText name="회고 참여자">
                  총 {reviewForm?.participants?.length}명이 참여함
                </ListView.InfoText>
                <ListView.InfoText name="업데이트">{reviewForm?.info.updateDate}</ListView.InfoText>
              </FlexContainer>

              <ListView.JoinButton reviewFormCode={reviewFormCode} />

              <ListView.FormCopyLink reviewFormCode={reviewFormCode} />

              <ListView.FormManageButtons
                reviewFormCode={reviewFormCode}
                isMine={reviewForm?.info.isSelf}
              />
            </ListView.FormDetail>
          </ListView.SideMenu>
        </ListView>
      ) : (
        <SheetView>
          <SheetView.Questions>
            {reviewForm?.questions.map((question) => (
              <SheetView.Item key={question.id} isTitle>
                {question.value}
              </SheetView.Item>
            ))}
          </SheetView.Questions>

          <SheetView.ReviewList>
            {pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.reviews.map(
                  ({ id, info: { creator, reviewTitle }, questions }, index) => (
                    <SheetView.Answers
                      key={id}
                      // ref={
                      //   displayMode === 'sheet' && index === PAGE_OPTION.REVIEW_ITEM_SIZE - 1
                      //     ? targetRef
                      //     : null
                      // }
                    >
                      <SheetView.Creator
                        socialId={creator.id}
                        title={reviewTitle as string}
                        profileImage={creator.profileUrl}
                      />

                      {questions.map(({ answer, ...review }) => (
                        <SheetView.Item key={review.id}>{answer && answer.value}</SheetView.Item>
                      ))}
                    </SheetView.Answers>
                  ),
                )}
              </React.Fragment>
            ))}
            {isFetching && <SheetView.Loading line={PAGE_OPTION.REVIEW_ITEM_SIZE} />}
            <div ref={targetRef} />
          </SheetView.ReviewList>
        </SheetView>
      )}
    </div>
  );
}

export default ReviewOverViewPage;
