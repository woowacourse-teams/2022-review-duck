import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetchGetReviewForm, RequestGetReviewForm, ResponseGetReviewForm } from 'apis/review';

export function useGetReviewFormQuery(
  params: RequestGetReviewForm,
  options: UseQueryOptions<ResponseGetReviewForm> = {},
) {
  return useQuery({
    queryKey: ['getReviewForm', params],
    queryFn: () => fetchGetReviewForm(params),
    ...options,
  });
}
