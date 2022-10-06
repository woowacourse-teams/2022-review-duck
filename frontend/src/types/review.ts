import { UserProfile } from './user';

export interface Question {
  id?: number;
  value: string;
  description: string;
  answer?: Answer;
}

export interface AnsweredQuestion<RequiredAnswerId = true>
  extends RequiredPartialType<Question, 'id'> {
  answer: RequiredAnswerId extends true ? Required<Answer> : Answer;
}
export interface Answer {
  id?: number;
  value: string;
}

export interface UserContentRequireField {
  creator: UserProfile;
  isSelf: boolean;
  updateDate: string;
  isPrivate?: boolean;
  reviewTitle?: string;
}

export interface ReviewForm {
  title: string;
  questions: Question[];
  info: UserContentRequireField;
  participants?: UserProfile[];
}

export interface ReviewAnswer {
  questions: AnsweredQuestion<false>[];
  info: {
    reviewTitle: string;
    isPrivate: boolean;
  };
}

export interface ReviewFormAnswer {
  id: number;
  questions: AnsweredQuestion[];
  info: UserContentRequireField;
}

export interface ReviewPublicAnswer extends ReviewFormAnswer {
  reviewFormCode: string;
  likes: number;
}

export type ReviewFormAnswerList = {
  isLastPage: boolean;
  reviews: ReviewFormAnswer[];
};

export interface ReviewPublicAnswerList {
  isLastPage: boolean;
  numberOfReviews: number;
  reviews: ReviewPublicAnswer[];
}

// API 관련 타입

export interface ServerQuestion {
  id?: number;
  value: string;
  description: string;
}
export interface ServerQuestionRequireId {
  id: number;
  value: string;
  description: string;
}

export interface ServerAnswer {
  id?: number;
  value: string;
}

export interface ServerAnswerRequireId {
  id: number;
  value: string;
}

export interface ReviewFormResponse {
  reviewFormTitle: string;
  questions: Question[];
}

export interface GetReviewFormResponse extends ReviewFormResponse {
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  participants: UserProfile[];
}

export interface GetReviewAnswerResponse {
  reviewTitle: string;
  isPrivate: boolean;
  contents: Array<{
    question: ServerQuestionRequireId;
    answer: ServerAnswerRequireId;
  }>;
}

export type GetReviewFormAnswerResponse = {
  numberOfReviews: number;
  isLastPage: boolean;
  reviews: Array<{
    id: number;
    reviewTitle: string;
    updatedAt: number;
    likes: number;
    isCreator: boolean;
    creator: UserProfile;
    contents: Array<{
      question: ServerQuestionRequireId;
      answer: ServerAnswerRequireId;
    }>;
  }>;
};

export interface GetReviewPublicAnswerResponse {
  isLastPage: boolean;
  numberOfReviews: number;
  reviews: Array<{
    id: number;
    reviewFormCode: string;
    updatedAt: number;
    likes: number;
    creator: UserProfile;
    isCreator: boolean;
    contents: Array<{
      question: ServerQuestionRequireId;
      answer: ServerAnswerRequireId;
    }>;
  }>;
}

export type CreateReviewFormRequest = ReviewFormResponse;

export interface CreateReviewFormResponse {
  reviewFormCode: string;
}

export interface CreateReviewAnswerRequest {
  reviewFormCode: string;
  reviewTitle: string;
  contents: Array<{
    questionId: number;
    answer: ServerAnswer;
  }>;
  isPrivate: boolean;
}

export interface CreateFormByTemplateRequest {
  templateId: number;
  reviewFormTitle: string;
  questions: ServerQuestion[];
}

export type CreateFormByTemplateResponse = UpdateReviewFormResponse;

export type CreateReviewAnswerResponse = null;

export interface UpdateReviewFormRequest extends ReviewFormResponse {
  reviewFormCode: string;
}

export interface UpdateReviewFormResponse {
  reviewFormCode: string;
}

export interface UpdateReviewAnswerRequest {
  reviewTitle: string;
  reviewId: number;
  contents: Array<{
    questionId: number;
    answer: ServerAnswer;
  }>;
  isPrivate: boolean;
}

export interface UpdateReviewLikeRequest {
  reviewId: number;
  likes: number;
}

export type UpdateReviewLikeResponse = Omit<UpdateReviewLikeRequest, 'reviewId'>;

export type UpdateReviewAnswerResponse = null;

export type DeleteReviewFormResponse = null;

export type DeleteReviewAnswerResponse = null;

export type TimelineFilterType = 'trend' | 'latest';

export type DisplayModeType = 'list' | 'sheet';
