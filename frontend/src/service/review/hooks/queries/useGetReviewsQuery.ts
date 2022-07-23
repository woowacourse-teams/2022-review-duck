import { useQuery } from 'react-query';

import reviewAPI from 'service/review/api';

function useGetReviewsQuery(reviewFormCode: string, queryOptions: any = {}) {
  const getReviewsQuery = useQuery(
    ['getReviews', { reviewFormCode }],
    () => reviewAPI.getReviews(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );

  return getReviewsQuery;
}

export default useGetReviewsQuery;
