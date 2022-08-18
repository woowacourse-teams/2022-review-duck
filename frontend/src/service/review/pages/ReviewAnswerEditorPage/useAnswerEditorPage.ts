import {
  ErrorResponse,
  Question,
  ReviewForm,
  UpdateReviewAnswerRequest,
} from 'service/@shared/types';

import { useGetAuthProfile } from 'service/@shared/hooks/queries/auth';
import {
  useCreateReviewAnswer,
  useGetReviewAnswer,
  useGetReviewForm,
  useUpdateReviewAnswer,
} from 'service/@shared/hooks/queries/review';

interface SubmitHandler {
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}

const initialReviewContents: ReviewForm = {
  title: '',
  questions: [],
  info: {
    creator: {
      id: -1,
      socialNickname: 'user-id',
      nickname: '닉네임',
      profileUrl: '',
    },
    isSelf: false,
    updateDate: '0일 전',
  },
};

const changeRequestBody = (questions: Question[]) =>
  questions.map(({ id, answer }) => ({
    questionId: id,
    answer,
  })) as UpdateReviewAnswerRequest['contents'];

function useAnswerEditorPage(reviewFormCode: string, reviewId: string) {
  const createMutation = useCreateReviewAnswer();
  const updateMutation = useUpdateReviewAnswer();

  const userProfileQuery = useGetAuthProfile();
  const reviewFormQuery = useGetReviewForm(reviewFormCode);
  const reviewAnswerQuery = useGetReviewAnswer(Number(reviewId), {
    enabled: !!reviewId,
  });

  const reviewContents = reviewAnswerQuery.data || reviewFormQuery.data || initialReviewContents;

  const submitCreateAnswer = (questions: Question[], handler: SubmitHandler) => {
    const { onSuccess, onError } = handler;
    const requestContents = changeRequestBody(questions);

    createMutation.mutate(
      {
        reviewFormCode,
        contents: requestContents,
      },
      {
        onSuccess,
        onError,
      },
    );
  };

  const submitUpdateAnswer = (reviewId: string, questions: Question[], handler: SubmitHandler) => {
    const { onSuccess, onError } = handler;
    const requestContents = changeRequestBody(questions);

    updateMutation.mutate(
      { reviewId: Number(reviewId), contents: requestContents },
      { onSuccess, onError },
    );
  };

  return {
    authorProfile: userProfileQuery.data,
    reviewForm: reviewFormQuery.data,
    reviewContents,
    submitCreateAnswer,
    submitUpdateAnswer,
  };
}

export default useAnswerEditorPage;
