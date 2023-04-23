import { useMutation } from '@tanstack/react-query';

import queryClient from 'api/config/queryClient';
import { queryKeys } from 'apis/keys';
import {
  fetchDeleteReview,
  fetchDeleteReviewForm,
  fetchPostCreateReview,
  fetchPostCreateReviewForm,
  fetchPostCreateReviewFormByTemplate,
  fetchPostUpdateReviewLike,
  fetchPutUpdateReviewForm,
} from 'apis/review';
import { UseCustomMutationOptions } from 'types';

export default function useReviewMutations(
  mutationOptions: UseCustomMutationOptions<unknown> = {},
) {
  const createReviewForm = useMutation(fetchPostCreateReviewForm, {
    ...mutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.review.getPublicReviewList());
    },
  });
  const createReviewFormByTemplate = useMutation(fetchPostCreateReviewFormByTemplate, {
    ...mutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.review.getPublicReviewList());
    },
  });
  const createReview = useMutation(fetchPostCreateReview, {
    ...mutationOptions,
    onSuccess: (_, { reviewFormCode }) => {
      queryClient.invalidateQueries(queryKeys.review.getReviewForm({ reviewFormCode }));
      queryClient.invalidateQueries(queryKeys.review.getPublicReviewList());
    },
  });

  const updateReviewForm = useMutation(fetchPutUpdateReviewForm, {
    ...mutationOptions,
    onSuccess: (_, { reviewFormCode }) => {
      queryClient.invalidateQueries(queryKeys.review.getReviewForm({ reviewFormCode }));
      queryClient.invalidateQueries(queryKeys.review.getPublicReviewList());
    },
  });
  const updateReviewLike = useMutation(fetchPostUpdateReviewLike, {
    ...mutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.review.getPublicReviewList());
    },
  });

  const deleteReviewForm = useMutation(fetchDeleteReviewForm, {
    ...mutationOptions,
  });
  const deleteReview = useMutation(fetchDeleteReview, {
    ...mutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.review.getReviewForm()); // TODO: 삭제 후 Response 값에 reviewFormCode가 없어서 단일 invalidateQueries가 안됨. ReviewForm 전체 캐싱 날려버림. 추가 요청 필요
      queryClient.invalidateQueries(queryKeys.review.getPublicReviewList());
    },
  });

  return {
    createReviewForm,
    createReviewFormByTemplate,
    createReview,
    updateReviewForm,
    updateReviewLike,
    deleteReviewForm,
    deleteReview,
  };
}
