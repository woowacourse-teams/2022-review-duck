import useGetMyReviewForms from 'service/community/hooks/queries/useGetMyReviewForms';
import useGetMyReviews from 'service/community/hooks/queries/useGetMyReviews';

import { MYPAGE_TAB } from 'service/@shared/constants/index';

function useMyPageQueries(filter: string) {
  const getMyReviewsQuery = useGetMyReviews({ enabled: filter === MYPAGE_TAB.MY_REVIEWS });
  const getMyRevieFromsQuery = useGetMyReviewForms({
    enabled: filter === MYPAGE_TAB.MY_REVIEW_FORMS,
  });

  const myReviews = getMyReviewsQuery.data || {
    numberOfReviews: 0,
    reviews: [],
  };

  const myReviewForms = getMyRevieFromsQuery.data || {
    numberOfReviewForms: 0,
    reviewForms: [],
  };

  const isError = getMyReviewsQuery.isError || getMyRevieFromsQuery.isError;

  const { error } = getMyReviewsQuery || getMyRevieFromsQuery;

  return { myReviews, myReviewForms, isError, error };
}

export default useMyPageQueries;
