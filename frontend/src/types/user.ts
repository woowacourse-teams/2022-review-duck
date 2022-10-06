import { ServerAnswerRequireId, ServerQuestionRequireId, Answer } from './review';

export interface UserProfile {
  id: number;
  socialNickname: string;
  nickname: string;
  profileUrl: string;
}

export interface UserArticleList {
  totalNumber: number;
  isMine: boolean;
  articleList: Array<{
    id?: number;
    reviewFormCode?: string;
    title: string;
    reviewTitle?: string;

    contents: Array<{
      question: ServerQuestionRequireId;
      answer?: Answer;
    }>;
  }>;
}

export interface GetUserReviewAnswerResponse {
  numberOfReviews: number;
  isMine: boolean;
  reviews: Array<{
    id: number;
    title: string;
    isPrivate: boolean;
    updatedAt: number;
    contents: Array<{
      question: ServerQuestionRequireId;
      answer: ServerAnswerRequireId;
    }>;

    reviewForm: {
      title: string;
      code: string;
      creator: UserProfile;
    };
  }>;
}

export interface GetUserReviewFormsResponse {
  numberOfReviewForms: number;
  isMine: boolean;
  reviewForms: Array<{
    title: string;
    code: string;
    updatedAt: number;
    questions: ServerQuestionRequireId[];
  }>;
}

export interface GetUserTemplatesResponse {
  numberOfTemplates: number;
  isMine: boolean;
  templates: Array<{
    info: {
      id: number;
      title: string;
      description: string;
      updatedAt: number;
      usedCount: number;
    };
    questions: ServerQuestionRequireId[];
  }>;
}

export interface GetUserProfileResponse {
  isMine: boolean;
  socialId: string;
  socialNickname: string;
  nickname: string;
  profileUrl: string;
}

export type UpdateProfileResponse = null;

export type Tabs = 'reviews' | 'review-forms' | 'templates';
