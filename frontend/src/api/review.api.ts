import * as ReviewType from '../types/review';

import { API_URI } from '../constant';
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

export const getFormAnswer = async (
  reviewFormCode = '',
  display = 'list',
): Promise<ReviewType.ReviewFormAnswerList> => {
  const { data } = await axiosInstance.get(API_URI.REVIEW.GET_FORM_ANSWER(reviewFormCode, display));

  return transformer.transformFormAnswer(data);
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
  const { data } = await axiosInstance.post(`/api/review-forms?templateId=${templateId}`, {
    reviewFormTitle,
    questions,
  });

  return data;
};

export const createAnswer = async ({
  reviewFormCode,
  contents,
  isPrivate,
}: ReviewType.CreateReviewAnswerRequest): Promise<ReviewType.CreateReviewAnswerResponse> => {
  const { data } = await axiosInstance.post(API_URI.REVIEW.CREATE_ANSWER(reviewFormCode), {
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
  reviewId,
  contents,
  isPrivate,
}: ReviewType.UpdateReviewAnswerRequest): Promise<ReviewType.UpdateReviewAnswerResponse> => {
  const { data } = await axiosInstance.put(API_URI.REVIEW.UPDATE_ANSWER(reviewId), {
    contents,
    isPrivate,
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
