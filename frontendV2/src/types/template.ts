import { Question } from './review';

export interface Template {
  isCreator?: boolean;
  info: {
    id: number;
    title: string;
    description: string;
    updatedAt: number;
    usedCount: number;
  };
  creator: {
    id: number;
    nickname: string;
    profileUrl: URLString;
    socialNickname: string;
  };
}

export interface CreateTemplateRequest {
  templateTitle: string;
  templateDescription: string;
  questions: Question[];
}

export interface GetTemplatesResponse {
  numberOfTemplates: number;
  templates: Template[];
}

export interface GetTemplateResponse extends Template {
  questions: Question[];
}

export interface CreateFormResponse {
  reviewFormCode: string;
}

export interface CreateTemplateResponse {
  templateId: number;
}

export type UpdateTemplateRequest = CreateTemplateResponse & CreateTemplateRequest;

export type TemplateFilterType = 'trend' | 'latest';
