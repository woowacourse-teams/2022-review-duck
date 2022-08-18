import { ServerAnswerRequireId, ServerQuestionRequireId } from './review';

export interface UserProfile {
  id: number;
  socialNickname: string;
  nickname: string;
  profileUrl: string;
}

export interface GetUserReviewAnswerResponse {
  numberOfReviews: number;
  isMine: boolean;
  reviews: Array<{
    id: number;
    title: string;
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

export interface GetUserProfileResponse {
  isMine: boolean;
  socialId: string;
  socialNickname: string;
  nickname: string;
  profileUrl: string;
}
