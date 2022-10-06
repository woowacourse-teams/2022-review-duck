import {
  ErrorResponse,
  Question,
  ReviewAnswer,
  ReviewForm,
  UpdateReviewAnswerRequest,
} from 'types';

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

const initialReviewForm: ReviewForm = {
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
    isPrivate: false,
  },
};

const initialReviewAnswer: ReviewAnswer = {
  questions: [],
  info: {
    reviewTitle: '',
    isPrivate: false,
  },
};

interface CreateParameters {
  reviewTitle: string;
  reviewId?: string;
  questions: Question[];
  isPrivate: boolean;
}

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

  const reviewForm = reviewFormQuery.data || initialReviewForm;
  const reviewAnswer = reviewAnswerQuery.data || initialReviewAnswer;

  const submitCreateAnswer = (
    { reviewTitle, questions, isPrivate }: CreateParameters,
    handler: SubmitHandler,
  ) => {
    const { onSuccess, onError } = handler;
    const requestContents = changeRequestBody(questions);

    createMutation.mutate(
      {
        reviewFormCode,
        reviewTitle,
        contents: requestContents,
        isPrivate,
      },
      {
        onSuccess,
        onError,
      },
    );
  };

  const submitUpdateAnswer = (
    { reviewTitle, reviewId, questions, isPrivate }: CreateParameters,
    handler: SubmitHandler,
  ) => {
    const { onSuccess, onError } = handler;
    const requestContents = changeRequestBody(questions);

    updateMutation.mutate(
      { reviewTitle, reviewId: Number(reviewId), contents: requestContents, isPrivate },
      { onSuccess, onError },
    );
  };

  return {
    authorProfile: userProfileQuery.data,
    reviewForm: reviewForm,
    reviewAnswer: reviewAnswer,
    submitCreateAnswer,
    submitUpdateAnswer,
  };
}

export default useAnswerEditorPage;
