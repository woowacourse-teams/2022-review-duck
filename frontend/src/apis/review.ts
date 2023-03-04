import axiosInstance from 'api/config/axiosInstance';
import {
  UserProfileDTO,
  QuestionDTO,
  ReviewContentDTO,
  ReviewFormDTO,
  TemplateDTO,
  AnswerDTO,
} from 'models/review';

export type RequestGetReviewForm = {
  reviewFormCode: string;
};
export type ResponseGetReviewForm = {
  reviewFormTitle: string;
  updatedAt: number;
  creator: UserProfileDTO;
  isCreator: boolean;
  questions: Array<QuestionDTO>;
  participants: Array<UserProfileDTO>;
};
export const fetchGetReviewForm = async ({
  reviewFormCode,
}: RequestGetReviewForm): Promise<ResponseGetReviewForm> => {
  const response = await axiosInstance.get(`/api/review-forms/${reviewFormCode}`);

  return response.data;
};

export type RequestGetReview = {
  reviewId: number;
};
export type ResponseGetReview = {
  reviewTitle: string;
  contents: Array<ReviewContentDTO>;
  isPrivate: boolean;
};
export const fetchGetReviewFormReview = async ({
  reviewId,
}: RequestGetReview): Promise<ResponseGetReview> => {
  const response = await axiosInstance.get(`/api/reviews/${reviewId}`);

  return response.data;
};

export type RequestGetReviewFormReviewList = {
  reviewFormCode: string;
  display: 'list' | 'sheet';
  page: number;
  size: number;
};
export type ResponseGetReviewFormReviewList = {
  numberOfReviews: number; // 회고 갯수
  isLastPage: boolean;
  reviews: Array<ReviewFormDTO>;
};
export const fetchGetReviewFormReviewList = async ({
  reviewFormCode,
  display,
  page,
  size,
}: RequestGetReviewFormReviewList): Promise<ResponseGetReviewFormReviewList> => {
  const response = await axiosInstance.get(
    `/api/review-forms/${reviewFormCode}/reviews?displayType=${display}&page=${page}&size=${size}`,
  );

  return response.data;
};

export type RequestGetPublicReviewList = {
  page: number;
  size: number;
  filter: 'latest' | 'trend';
};
export type ResponseGetPublicReviewList = {
  numberOfReviews: number;
  isLastPage: boolean;
  reviews: Array<ReviewFormDTO>;
};
export const fetchGetPublicReviewList = async ({
  page = 1,
  size = 5,
  filter = 'trend',
}: RequestGetPublicReviewList): Promise<ResponseGetPublicReviewList> => {
  const response = await axiosInstance.get(
    `/api/reviews/public?page=${page}&size=${size}&sort=${filter}`,
  );

  return response.data;
};

export type RequestPostCreateReviewForm = {
  reviewFormTitle: ReviewFormDTO['reviewTitle'];
  questions: Array<QuestionDTO>;
};
export type ResponsePostCreateReviewForm = {
  reviewFormCode: ReviewFormDTO['reviewFormCode'];
};
export const fetchPostCreateReviewForm = async (
  params: RequestPostCreateReviewForm,
): Promise<ResponsePostCreateReviewForm> => {
  const response = await axiosInstance.post(`/api/review-forms`, params);

  return response.data;
};

export type RequestPostCreateReviewFormByTemplate = {
  templateId: TemplateDTO['info']['id'];
  reviewFormTitle: ReviewFormDTO['reviewTitle'];
  questions: QuestionDTO[];
};
export type ResponsePostCreateReviewFormByTemplate = {
  reviewFormCode: ReviewFormDTO['reviewFormCode'];
};
export const fetchPostCreateReviewFormByTemplate = async ({
  templateId,
  ...params
}: RequestPostCreateReviewFormByTemplate): Promise<ResponsePostCreateReviewFormByTemplate> => {
  const response = await axiosInstance.post(
    `/api/templates/${templateId}/review-forms/edited`,
    params,
  );

  return response.data;
};

export type RequestPostCreateReview = {
  reviewFormCode: ReviewFormDTO['reviewFormCode'];
  reviewTitle: ReviewFormDTO['reviewTitle'];
  contents: Array<{
    questionId: Required<QuestionDTO['id']>;
    answer: AnswerDTO;
  }>;
  isPrivate: boolean;
};
export type ResponsePostCreateReview = void;
export const fetchPostCreateReview = async ({
  reviewFormCode,
  ...params
}: RequestPostCreateReview): Promise<ResponsePostCreateReview> => {
  const response = await axiosInstance.post(`/api/review-forms/${reviewFormCode}`, params);

  return response.data;
};

export type RequestPutUpdateReviewForm = {
  reviewFormCode: string;
  reviewFormTitle: string;
  questions: QuestionDTO[];
};
export type ResponsePutUpdateReviewForm = void;
export const fetchPutUpdateReviewForm = async ({
  reviewFormCode,
  ...params
}: RequestPutUpdateReviewForm): Promise<ResponsePutUpdateReviewForm> => {
  const response = await axiosInstance.put(`/api/review-forms/${reviewFormCode}`, params);

  return response.data;
};

export type RequestPostUpdateReviewLike = {
  reviewId: number;
  likes: number;
};
export type ResponsePostUpdateReviewLike = {
  likes: number;
};
export const fetchPostUpdateReviewLike = async ({
  reviewId,
  ...params
}: RequestPostUpdateReviewLike): Promise<ResponsePostUpdateReviewLike> => {
  const response = await axiosInstance.post(`/api/reviews/${reviewId}/likes`, params);

  return response.data;
};

export type RequestDeleteReviewForm = {
  reviewFormCode: ReviewFormDTO['reviewFormCode'];
};
export type ResponseDeleteReviewForm = void;
export const fetchDeleteReviewForm = async ({
  reviewFormCode,
}: RequestDeleteReviewForm): Promise<ResponseDeleteReviewForm> => {
  const response = await axiosInstance.delete(`/api/review-forms/${reviewFormCode}`);

  return response.data;
};

export type RequestDeleteReview = {
  reviewId: number;
};
export type ResponseDeleteReview = void;
export const fetchDeleteReview = async ({
  reviewId,
}: RequestDeleteReview): Promise<ResponseDeleteReview> => {
  const response = await axiosInstance.delete(`/api/reviews/${reviewId}`);

  return response.data;
};
