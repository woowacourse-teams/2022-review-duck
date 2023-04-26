import axiosInstance from 'api/config/axiosInstance';
import { QuestionDTO, ReviewFormDTO, TemplateDTO, AnswerDTO, ReviewDTO, ReviewFormCodeDTO } from 'models/review';

export type RequestGetReviewForm = {
  reviewFormCode: ReviewFormCodeDTO;
};
export type ResponseGetReviewForm = ReviewFormDTO;
export const fetchGetReviewForm = async ({ reviewFormCode }: RequestGetReviewForm): Promise<ResponseGetReviewForm> => {
  const response = await axiosInstance.get(`/api/review-forms/${reviewFormCode}`);

  return response.data;
};

export type RequestGetReviewFormReviewList = {
  reviewFormCode: ReviewFormCodeDTO;
  display: 'list' | 'sheet';
  page: number;
  size: number;
};
export type ResponseGetReviewFormReviewList = {
  numberOfReviews: number; // 회고 갯수
  isLastPage: boolean;
  reviews: Array<ReviewDTO>;
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
  page?: number;
  size?: number;
  filter?: 'latest' | 'trend';
};
export type ResponseGetPublicReviewList = {
  numberOfReviews: number;
  isLastPage: boolean;
  reviews: Array<ReviewDTO>;
};
export const fetchGetPublicReviewList = async ({
  page = 1,
  size = 5,
  filter = 'trend',
}: RequestGetPublicReviewList): Promise<ResponseGetPublicReviewList> => {
  const response = await axiosInstance.get(`/api/reviews/public?page=${page}&size=${size}&sort=${filter}`);

  return response.data;
};

export type RequestPostCreateReviewForm = {
  reviewFormTitle: ReviewFormDTO['reviewFormTitle'];
  questions: Array<QuestionDTO>;
};
export type ResponsePostCreateReviewForm = {
  reviewFormCode: ReviewFormCodeDTO;
};
export const fetchPostCreateReviewForm = async (
  params: RequestPostCreateReviewForm,
): Promise<ResponsePostCreateReviewForm> => {
  const response = await axiosInstance.post(`/api/review-forms`, params);

  return response.data;
};

export type RequestPostCreateReviewFormByTemplate = {
  templateId: TemplateDTO['info']['id'];
  reviewFormTitle: ReviewFormDTO['reviewFormTitle'];
  questions: QuestionDTO[];
};
export type ResponsePostCreateReviewFormByTemplate = {
  reviewFormCode: ReviewFormCodeDTO;
};
export const fetchPostCreateReviewFormByTemplate = async ({
  templateId,
  ...params
}: RequestPostCreateReviewFormByTemplate): Promise<ResponsePostCreateReviewFormByTemplate> => {
  const response = await axiosInstance.post(`/api/templates/${templateId}/review-forms/edited`, params);

  return response.data;
};

export type RequestPostCreateReview = {
  reviewFormCode: ReviewFormCodeDTO;
  reviewTitle: ReviewFormDTO['reviewFormTitle'];
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
  reviewFormCode: ReviewFormCodeDTO;
  reviewFormTitle: ReviewFormDTO['reviewFormTitle'];
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
  reviewFormCode: ReviewFormCodeDTO;
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
export const fetchDeleteReview = async ({ reviewId }: RequestDeleteReview): Promise<ResponseDeleteReview> => {
  const response = await axiosInstance.delete(`/api/reviews/${reviewId}`);

  return response.data;
};
