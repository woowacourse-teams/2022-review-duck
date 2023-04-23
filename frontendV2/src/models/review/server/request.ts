import { GithubNickname, GithubProfileURL, GithubUniqueUserId, Nickname } from 'models/@shared';

// 프로필 정보
export interface ResponseUserProfile {
  id: GithubUniqueUserId;
  socialNickname: GithubNickname;
  nickname: Nickname;
  profileURL: GithubProfileURL;
}

// 컨텐츠 제작자 및 추가 정보
export interface ResponseCreatorContent {
  creator: ResponseUserProfile;
  reviewTitle?: string; // 사용자 커스텀 회고 제목
  updateDate: string;
  isSelf: boolean;
  isPrivate?: boolean;
}

// 회고의 질문의 답변
export interface ResponseAnswer {
  id: number;
  value: string;
}

// 회고의 질문
export interface ResponseQuestion {
  id: number;
  value: string;
  description: string;
  answer?: ResponseAnswer;
}

// 회고 모임 정보
export interface ResponseReviewForm {
  title: string;
  questions: ResponseQuestion[];
  info: ResponseCreatorContent;
  participants: ResponseUserProfile[];
}

// 회고 모임
