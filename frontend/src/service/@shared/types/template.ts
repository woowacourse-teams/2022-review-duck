export interface Template {
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
    profileUrl: string;
    socialNickname?: string;
    bio?: string;
  };
}

export interface GetTemplatesResponse {
  templates: Template[];
}

export interface GetTemplateResponse extends Template {
  questions: Array<{
    id: number;
    value: string;
    description: string;
  }>;
}

export interface CreateFormResponse {
  reviewFormCode: string;
}

export type TemplateFilterType = 'trend' | 'latest';
