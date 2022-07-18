export interface Question {
  questionId?: number | null;
  questionValue: string;
  questionDescription?: string;
  answerValue?: string;
  listKey?: string | undefined;
}

export interface ReviewFormRequest {
  reviewTitle: string;
  reviewFormCode?: string | null;
  questions: Question[];
}

export interface ReviewFormResponse {
  reviewFormCode: string;
}

export interface ErrorResponse {
  message: string;
}

export type RequiredPartialType<Type, P extends keyof Type> = Type & {
  [key in P]-?: Type[key];
};

export interface SubmitAnswer {
  reviewFormCode: string;
  answers: {
    answerValue: string;
    questionId: number | null | undefined;
  }[];
  nickname: string;
}
