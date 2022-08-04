import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types/index';
import { GetMyReviewFormsResponse } from 'service/community/types';

import { QUERY_KEY } from 'service/@shared/constants';
import myReviewAPI from 'service/community/api';

function useGetMyReviewForms(
  queryOptions?: UseQueryOptions<GetMyReviewFormsResponse, ErrorResponse>,
) {
  return useQuery<GetMyReviewFormsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_MY_REVIEW_FORMS],
    () => myReviewAPI.getMyReviewForms(),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetMyReviewForms;
