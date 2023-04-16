import { GithubNickname, GithubProfileURL, GithubUniqueUserId } from 'models/@shared';

export type ReviewFormCodeDTO = string;

export interface QuestionDTO {
  id?: number;
  value: string;
  description: string;
}

export interface AnswerDTO {
  id?: number;
  value: string;
}

export interface ReviewContentDTO {
  question: QuestionDTO;
  answer: AnswerDTO;
}

export interface UserProfileDTO {
  id: GithubUniqueUserId;
  nickname: string;
  socialNickname: GithubNickname;
  profileUrl: GithubProfileURL;
}

export interface ReviewFormDTO {
  id: number;
  reviewFormTitle: string;
  questions: Array<QuestionDTO>;
  creator: UserProfileDTO;
  updatedAt: number;
  isCreator: boolean;
  participants: Array<UserProfileDTO>;
}

// ReviewFormDTO와 통일 필요
export interface MyReviewFormDTO {
  title: string;
  code: string;
  updatedAt: number;
  questions: Array<QuestionDTO>;
}

export interface ReviewDTO {
  id: number;
  reviewTitle: string;
  updatedAt: number;
  likes: number;
  creator: UserProfileDTO;
  isCreator: boolean;
  contents: Array<ReviewContentDTO>;
}

export interface TemplateDTO {
  info: {
    id: number;
    title: string;
    description: string;
    updatedAt: number;
    usedCount: number;
  };
  creator: UserProfileDTO;
  isCreator: boolean;
}
