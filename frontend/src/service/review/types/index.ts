import { UseMutationOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';

export interface Question {
  questionId?: number | null;
  questionValue?: string;
  questionDescription?: string;
  answerId?: number;
  answerValue?: string;
  listKey?: string | undefined;
}

export interface ReviewForm {
  reviewTitle: string;
  questions: Question[];
}

export interface Answer {
  questionValue: string;
  answerId?: number;
  answerValue: string;
}

export interface GetReviewFormResponse {
  reviewTitle: string;
  updatedAt: number;
  creator: {
    nickname: string;
    profileUrl: string;
  };
  isCreator: boolean;
  questions: Question[];
}

export interface Review {
  reviewId: number;
  updatedAt: number;
  isMine: boolean;
  participant: {
    nickname: string;
    profileUrl: string;
  };
  answers: Answer[];
}

export interface GetReviewsResponse {
  reviews: Review[];
}

export interface GetReviewResponse {
  answers: Answer[];
}

export interface UpdateReviewFormRequest extends ReviewForm {
  reviewFormCode?: string | null;
}

export interface UpdateReviewFormResponse {
  reviewFormCode: string;
}

export type RequiredPartialType<Type, P extends keyof Type> = Type & {
  [key in P]-?: Type[key];
};

export interface SubmitAnswerRequest {
  reviewFormCode: string;
  answers: {
    answerValue: string;
    questionId: number | null | undefined;
  }[];
}

export interface UpdateReviewRequest {
  reviewId: number;
  answers: Question[];
}

export type UseCustomMutationOptions<TData = unknown> = UseMutationOptions<
  TData,
  ErrorResponse,
  unknown
>;

export interface RedirectState {
  redirect: string;
}
