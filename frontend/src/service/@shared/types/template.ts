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
  questions: {
    id: number;
    value: string;
    description: string;
  }[];
}

export type GetTemplatesResponse = Template[];
