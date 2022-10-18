import * as ReviewType from '../types/review';

import { API_URI, FILTER, PAGE_OPTION } from '../constant';
import * as transformer from './review.transformer';
import axiosInstance from 'api/config/axiosInstance';

export const getForm = async (reviewFormCode = ''): Promise<ReviewType.ReviewForm> => {
  const { data } = await axiosInstance.get(API_URI.REVIEW.GET_FORM(reviewFormCode));

  return transformer.transformForm(data);
};

export const getAnswer = async (reviewId: number): Promise<ReviewType.ReviewAnswer> => {
  const { data } = await axiosInstance.get(API_URI.REVIEW.GET_ANSWER(reviewId));

  return transformer.transformAnswer(data);
};

interface GetReviewFormAnswerRequest {
  pageNumber?: number;
  size?: number;
  reviewFormCode: string;
  display?: ReviewType.DisplayModeType;
}

export const getFormAnswer = async ({
  pageNumber = 1,
  size = PAGE_OPTION.REVIEW_ITEM_SIZE,
  reviewFormCode = '',
  display = 'list',
}: GetReviewFormAnswerRequest): Promise<ReviewType.ReviewFormAnswerList> => {
  const { data } = await axiosInstance.get(
    API_URI.REVIEW.GET_FORM_ANSWER(reviewFormCode, display, pageNumber, size),
  );

  return transformer.transformFormAnswer(data);
};

interface GetReviewPublicAnswerRequest {
  pageNumber?: number;
  size?: number;
  filter?: ReviewType.TimelineFilterType;
}

export const getPublicAnswer = async ({
  pageNumber = 1,
  size = PAGE_OPTION.REVIEW_ITEM_SIZE,
  filter = 'trend',
}: GetReviewPublicAnswerRequest): Promise<ReviewType.ReviewPublicAnswerList> => {
  const { data } = await axiosInstance.get(
    `${API_URI.REVIEW.GET_PUBLIC_ANSWER}?${FILTER.PAGE}=${pageNumber}&${FILTER.SIZE}=${size}&${FILTER.SORT}=${filter}`,
  );

  return transformer.transformPublicAnswer(data);
};

export const createForm = async (
  query: ReviewType.CreateReviewFormRequest,
): Promise<ReviewType.CreateReviewFormResponse> => {
  const { data } = await axiosInstance.post(API_URI.REVIEW.CREATE_FORM, query);

  return data;
};

export const createFormByTemplate = async ({
  templateId,
  reviewFormTitle,
  questions,
}: ReviewType.CreateFormByTemplateRequest) => {
  const { data } = await axiosInstance.post<ReviewType.CreateFormByTemplateResponse>(
    API_URI.REVIEW.CREATE_FORM_BY_TEMPLATE(templateId),
    {
      reviewFormTitle,
      questions,
    },
  );

  return data;
};

export const createAnswer = async ({
  reviewFormCode,
  reviewTitle,
  contents,
  isPrivate,
}: ReviewType.CreateReviewAnswerRequest): Promise<ReviewType.CreateReviewAnswerResponse> => {
  const { data } = await axiosInstance.post(API_URI.REVIEW.CREATE_ANSWER(reviewFormCode), {
    title: reviewTitle,
    contents,
    isPrivate,
  });

  return data;
};

export const updateForm = async ({
  reviewFormCode,
  reviewFormTitle,
  questions,
}: ReviewType.UpdateReviewFormRequest): Promise<ReviewType.UpdateReviewFormResponse> => {
  const { data } = await axiosInstance.put(API_URI.REVIEW.UPDATE_FORM(reviewFormCode), {
    reviewFormTitle,
    questions,
  });

  return data;
};

export const updateAnswer = async ({
  reviewTitle,
  reviewId,
  contents,
  isPrivate,
}: ReviewType.UpdateReviewAnswerRequest): Promise<ReviewType.UpdateReviewAnswerResponse> => {
  const { data } = await axiosInstance.put(API_URI.REVIEW.UPDATE_ANSWER(reviewId), {
    title: reviewTitle,
    contents,
    isPrivate,
  });

  return data;
};

export const updateReviewLike = async ({
  reviewId,
  likes,
}: ReviewType.UpdateReviewLikeRequest): Promise<ReviewType.UpdateReviewLikeResponse> => {
  const { data } = await axiosInstance.post(`/api/reviews/${reviewId}/likes`, {
    likes,
  });

  return data;
};

export const deleteForm = async (
  reviewFormCode = '',
): Promise<ReviewType.DeleteReviewFormResponse> => {
  const { data } = await axiosInstance.delete(API_URI.REVIEW.DELETE_FORM(reviewFormCode));

  return data;
};

export const deleteAnswer = async (
  reviewId: number,
): Promise<ReviewType.DeleteReviewAnswerResponse> => {
  const { data } = await axiosInstance.delete(API_URI.REVIEW.DELETE_ANSWER(reviewId));

  return data;
};
