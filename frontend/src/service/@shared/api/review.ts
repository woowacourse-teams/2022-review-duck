import {
  UpdateReviewFormRequest,
  SubmitAnswerRequest,
  GetReviewFormResponse,
  UpdateReviewFormResponse,
  GetReviewsResponse,
  GetReviewResponse,
  UpdateReviewRequest,
} from '../types';

import { API_URI } from '../constants';
import axiosInstance from 'service/@shared/api/config/axiosInstance';

export const getForm = async (reviewFormCode = ''): Promise<GetReviewFormResponse> => {
  const { data } = await axiosInstance.get(API_URI.REVIEW.GET_FORM(reviewFormCode));

  return data;
};

export const getAnswer = async (reviewId: number): Promise<GetReviewResponse> => {
  const { data } = await axiosInstance.get(API_URI.REVIEW.GET_ANSWER(reviewId));

  return data;
};

export const getFormAnswer = async (reviewFormCode = ''): Promise<GetReviewsResponse> => {
  const { data } = await axiosInstance.get(API_URI.REVIEW.GET_FORM_ANSWER(reviewFormCode));

  return data;
};

export const createForm = async (
  query: UpdateReviewFormRequest,
): Promise<UpdateReviewFormResponse> => {
  const { data } = await axiosInstance.post(API_URI.REVIEW.CREATE_FORM, query);

  return data;
};

export const createAnswer = async ({
  reviewFormCode,
  answers,
}: SubmitAnswerRequest): Promise<null> => {
  const { data } = await axiosInstance.post(API_URI.REVIEW.CREATE_ANSWER(reviewFormCode), {
    answers,
  });

  return data;
};

export const updateForm = async ({
  reviewFormCode,
  reviewTitle,
  questions,
}: UpdateReviewFormRequest): Promise<UpdateReviewFormResponse> => {
  const { data } = await axiosInstance.put(API_URI.REVIEW.UPDATE_FORM(reviewFormCode), {
    reviewTitle,
    questions,
  });

  return data;
};

export const updateAnswer = async ({ reviewId, answers }: UpdateReviewRequest): Promise<null> => {
  const { data } = await axiosInstance.put(API_URI.REVIEW.UPDATE_ANSWER(reviewId), {
    answers: answers,
  });

  return data;
};

export const deleteForm = async (reviewFormCode = ''): Promise<null> => {
  const { data } = await axiosInstance.delete(API_URI.REVIEW.DELETE_FORM(reviewFormCode));

  return data;
};

export const deleteAnswer = async (reviewId: number): Promise<null> => {
  const { data } = await axiosInstance.delete(API_URI.REVIEW.DELETE_ANSWER(reviewId));

  return data;
};
