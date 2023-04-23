import { useQuery } from '@tanstack/react-query';

import { queryKeys } from 'apis/keys';
import {
  fetchGetPublicReviewList,
  fetchGetReviewForm,
  fetchGetReviewFormReviewList,
  RequestGetPublicReviewList,
  RequestGetReviewForm,
  RequestGetReviewFormReviewList,
  ResponseGetPublicReviewList,
  ResponseGetReviewForm,
  ResponseGetReviewFormReviewList,
} from 'apis/review';
import { CustomQueryOptions } from 'models/@shared';

export function useGetReviewFormQuery(
  params: RequestGetReviewForm,
  options: CustomQueryOptions<ResponseGetReviewForm> = {},
) {
  return useQuery<ResponseGetReviewForm>({
    queryKey: queryKeys.review.getReviewForm(params),
    queryFn: () => fetchGetReviewForm(params),
    ...options,
  });
}

export function useGetReviewFormReviewListQuery(
  params: RequestGetReviewFormReviewList,
  options: CustomQueryOptions<ResponseGetReviewFormReviewList> = {},
) {
  return useQuery<ResponseGetReviewFormReviewList>({
    queryKey: queryKeys.review.getReviewFormReviewList(params),
    queryFn: () => fetchGetReviewFormReviewList(params),
    ...options,
  });
}

export function useGetPublicReviewListQuery(
  params: RequestGetPublicReviewList,
  options: CustomQueryOptions<ResponseGetPublicReviewList> = {},
) {
  return useQuery<ResponseGetPublicReviewList>({
    queryKey: queryKeys.review.getPublicReviewList(params),
    queryFn: () => fetchGetPublicReviewList(params),
    ...options,
  });
}
