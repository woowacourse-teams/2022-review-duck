export interface GetTemplatesResponse {
  templateId: number;
  templateTitle: string;
  templateDescription: string;
  creator: {
    nickname: string;
    profileUrl: string;
  };
  updatedAt: number;
  usedCount: number;
}
