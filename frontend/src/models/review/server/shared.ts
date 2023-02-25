import { GithubNickname, GithubProfileURL, GithubUniqueUserId } from 'models/@shared';

export interface UserProfileDTO {
  id: GithubUniqueUserId;
  nickname: string;
  socialNickname: GithubNickname;
  profileUrl: GithubProfileURL;
}

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

export interface ReviewFormDTO {
  id: number;
  reviewFormCode: string;
  reviewTitle: string;
  contents: Array<ReviewContentDTO>;
  creator: UserProfileDTO;
  likes: number;
  updatedAt: number;
  isCreator: boolean;
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
