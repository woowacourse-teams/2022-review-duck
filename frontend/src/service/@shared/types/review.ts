export interface Question {
  id?: number;
  value: string;
  description?: string;
}

export interface Answer {
  id?: number;
  value: string;
}

export interface UserContentRequireField {
  creator: UserProfile;
  isSelf: boolean;
  updateDate: string;
}

export interface ReviewForm {
  title: string;
  questions: Question[];
  info: UserContentRequireField;
}

export interface ReviewAnswer {
  id: number;
  answers: Array<{
    question: Required<Question>;
    answer: Answer;
  }>;
  info: UserContentRequireField;
}

export type ReviewFormAnswerList = Array<{
  id: number;
  answers: Array<{
    question: Required<Question>;
    answer: Required<Answer>;
  }>;
  info: UserContentRequireField;
}>;

// API 관련 타입

export interface ReviewFormResponse {
  reviewFormTitle: string;
  questions: Question[];
}

export interface GetReviewFormResponse extends ReviewFormResponse {
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
}

export interface GetReviewAnswerResponse {
  id: number;
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  contents: Array<{
    question: Required<Question>;
    answer: Required<Answer>;
  }>;
}

export type GetReviewFormAnswerResponse = Array<{
  id: number;
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  contents: Array<{
    question: Required<Question>;
    answer: Required<Answer>;
  }>;
}>;

export type CreateReviewFormRequest = ReviewFormResponse;

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

export interface UpdateReviewFormRequest extends ReviewFormResponse {
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
