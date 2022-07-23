import { useQuery } from 'react-query';

import reviewAPI from 'service/review/api';

function useGetReviewFormQuery(reviewFormCode: string, queryOptions: any = {}) {
  const getReviewFormQuery = useQuery(
    ['getReviewForm', { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );

  return getReviewFormQuery;
}

export default useGetReviewFormQuery;
