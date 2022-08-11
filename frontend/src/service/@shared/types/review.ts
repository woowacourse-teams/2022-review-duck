export interface Question {
  id?: number;
  value: string;
}

export interface Answer {
  id?: number;
  value: string;
}

export interface ReviewForm {
  reviewFormTitle: string;
  questions: Question[];
}

export interface ReviewContent {
  question: Question;
  answer: Answer;
}

export interface GetReviewFormResponse extends ReviewForm {
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
}

export interface GetReviewAnswerResponse {
  id: number;
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  contents: ReviewContent[];
}

export interface GetReviewFormAnswerResponse {
  id: number;
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  contents: ReviewContent[];
}

export type CreateReviewFormRequest = ReviewForm;

export interface CreateReviewFormResponse {
  reviewFormCode: string;
}

export interface CreateReviewAnswerRequest {
  reviewFormCode: string;
  contents: Array<{
    questionId: number;
    answer: {
      value: Answer;
    };
  }>;
}

export type CreateReviewAnswerResponse = null;

export interface UpdateReviewFormRequest extends ReviewForm {
  reviewFormCode: string;
}

export interface UpdateReviewFormResponse {
  reviewFormCode: string;
}

export interface UpdateReviewAnswerRequest {
  reviewId: number;
  contents: Array<{
    questionId: number;
    answer: Answer;
  }>;
}

export type UpdateReviewAnswerResponse = null;

export type DeleteReviewFormResponse = null;

export type DeleteReviewAnswerResponse = null;

export interface UserProfile {
  nickname: string;
  profileUrl: string;
}
