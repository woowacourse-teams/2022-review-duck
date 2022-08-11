export interface Template {
  templateId: number;
  templateTitle: string;
  templateDescription: string;
  creator: {
    nickname: string;
    profileUrl: string;
    socialId?: string;
    bio?: string;
  };
  updatedAt: number;
  usedCount: number;
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

export type GetTemplatesResponse = Template[];
