import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types/index';
import { GetMyReviewFormsResponse } from 'service/@shared/types/profile';

import myReviewAPI from 'service/@shared/api/user';
import { QUERY_KEY } from 'service/@shared/constants';

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
