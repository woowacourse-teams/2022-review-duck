import { Routes, Route } from 'react-router-dom';

import useAuth from 'service/@shared/hooks/useAuth';

import RequireAuth from 'service/@shared/components/RequireAuth';

import { PAGE_LIST } from 'service/@shared/constants';
import Authorize from 'service/@shared/pages/Authorize';
import Logout from 'service/@shared/pages/Logout';
import CommunityLayout from 'service/community/layout/CommunityLayout';
import MyPage from 'service/community/pages/MyPage';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import MainPage from 'service/review/pages/MainPage';
import Playground from 'service/review/pages/Playground';
import ReviewFormPage from 'service/review/pages/ReviewFormPage';
import ReviewJoinPage from 'service/review/pages/ReviewJoinPage';
import ReviewOverviewPage from 'service/review/pages/ReviewOverviewPage';
import ReviewPage from 'service/review/pages/ReviewPage';

function PageRoutes() {
  useAuth();

  return (
    <Routes>
      <Route element={<ReviewLayout />}>
        <Route index element={<MainPage />} />

        <Route element={<RequireAuth />}>
          <Route>
            <Route path={PAGE_LIST.REVIEW_JOIN} element={<ReviewJoinPage />} />
            <Route path={PAGE_LIST.REVIEW}>
              <Route index element={<ReviewPage />} />
              <Route path=":reviewFormCode" element={<ReviewPage />} />
              <Route path=":reviewFormCode/:reviewId" element={<ReviewPage />} />
            </Route>
          </Route>

          <Route path={PAGE_LIST.REVIEW_FORM}>
            <Route index element={<ReviewFormPage />} />
            <Route path={':reviewFormCode'} element={<ReviewFormPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<CommunityLayout />}>
        <Route element={<RequireAuth />}>
          <Route path={PAGE_LIST.MY_PAGE} element={<MyPage />} />
        </Route>

        <Route path="playground" element={<Playground />} />
      </Route>

      <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
        <Route element={<RequireAuth />}>
          <Route index element={<ReviewOverviewPage />} />
          <Route path=":reviewFormCode" element={<ReviewOverviewPage />} />
        </Route>
      </Route>

      <Route path={PAGE_LIST.AUTHORIZE} element={<Authorize />} />
    </Routes>
  );
}

export default PageRoutes;
