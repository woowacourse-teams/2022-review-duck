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
}

export interface ReviewForm {
  title: string;
  questions: Question[];
  info: UserContentRequireField;
}

export interface ReviewAnswer {
  id: number;
  questions: AnsweredQuestion<false>[];
  info: UserContentRequireField;
}

export interface ReviewFormAnswer {
  id: number;
  questions: AnsweredQuestion[];
  info: UserContentRequireField;
}

export type ReviewFormAnswerList = ReviewFormAnswer[];

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
}

export interface GetReviewAnswerResponse {
  id: number;
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  contents: Array<{
    question: ServerQuestionRequireId;
    answer: ServerAnswerRequireId;
  }>;
}

export type GetReviewFormAnswerResponse = Array<{
  id: number;
  updatedAt: number;
  creator: UserProfile;
  isCreator: boolean;
  contents: Array<{
    question: ServerQuestionRequireId;
    answer: ServerAnswerRequireId;
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
    answer: ServerAnswer;
  }>;
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
  reviewId: number;
  contents: Array<{
    questionId: number;
    answer: ServerAnswer;
  }>;
}

export type UpdateReviewAnswerResponse = null;

export type DeleteReviewFormResponse = null;

export type DeleteReviewAnswerResponse = null;
