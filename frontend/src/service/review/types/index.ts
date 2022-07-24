import { UseMutationOptions } from 'react-query';

import { AxiosError } from 'axios';

export type ErrorResponse = AxiosError<{ message: string }>;

export interface Question {
  questionId?: number | null;
  questionValue: string;
  questionDescription?: string;
  answerValue?: string;
  listKey?: string | undefined;
}

export interface Review {
  answers: Question[];
  nickname: string;
  reviewId: number;
  updatedAt: number;
}

export interface ReviewForm {
  reviewTitle: string;
  questions: Question[];
}

export type GetReviewFormResponse = ReviewForm;

export interface UpdateReviewFormRequest extends ReviewForm {
  reviewFormCode?: string | null;
}

export interface UpdateReviewFormResponse {
  reviewFormCode: string;
}

export interface GetReviewsResponse {
  reviewFormTitle: string;
  reviews: Review[];
  updatedAt: number;
}

export type CreateReviewAnswer = Omit<Review, 'reviewId' | 'updatedAt'>;

export type RequiredPartialType<Type, P extends keyof Type> = Type & {
  [key in P]-?: Type[key];
};

export interface SubmitAnswerRequest {
  reviewFormCode: string;
  answers: {
    answerValue: string;
    questionId: number | null | undefined;
  }[];
  nickname: string;
}

export type UseCustomMutationOptions = UseMutationOptions<unknown, ErrorResponse, unknown>;
