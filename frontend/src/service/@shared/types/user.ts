interface Answer {
  questionValue: string;
  answerValue: string;
}

interface Question {
  questionId: number;
  questionValue: string;
}

export interface GetMyReviewsResponse {
  numberOfReviews: number;
  reviews: {
    reviewId: number;
    updatedAt: number;
    answers: Answer[];
    reviewForm: {
      title: string;
      code: string;
      creator: {
        nickname: string;
        profileUrl: string;
      };
    };
  }[];
}

export interface GetMyReviewFormsResponse {
  numberOfReviewForms: number;
  reviewForms: {
    title: string;
    code: string;
    updatedAt: number;
    questions: Question[];
  }[];
}
