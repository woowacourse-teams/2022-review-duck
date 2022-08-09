import { Routes, Route } from 'react-router-dom';

import useAuth from 'service/@shared/hooks/useAuth';

import RequireAuth from 'service/@shared/components/RequireAuth';

import { PAGE_LIST } from 'service/@shared/constants';
import MainLayout from 'service/@shared/layout/MainLayout';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import Playground from 'service/review/pages/Playground';
import ReviewFormPage from 'service/review/pages/ReviewFormPage';
import ReviewJoinPage from 'service/review/pages/ReviewJoinPage';
import ReviewOverviewPage from 'service/review/pages/ReviewOverviewPage';
import ReviewPage from 'service/review/pages/ReviewPage';
import TemplateStorePage from 'service/template/pages/TemplateStorePage';
import Authorize from 'service/user/pages/Authorize';
import Logout from 'service/user/pages/Logout';
import MainPage from 'service/user/pages/MainPage';
import MyPage from 'service/user/pages/MyPage';

function PageRoutes() {
  useAuth();

  return (
    <Routes>
      <Route element={<ReviewLayout />}>
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
            <Route path=":reviewFormCode" element={<ReviewFormPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        <Route element={<RequireAuth />}>
          <Route path={PAGE_LIST.MY_PAGE} element={<MyPage />} />
        </Route>

        <Route path="playground" element={<Playground />} />
        <Route index element={<MainPage />} />
        <Route path={PAGE_LIST.TEMPLATE_SOTRE} element={<TemplateStorePage />} />
      </Route>

      <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
        <Route element={<RequireAuth />}>
          <Route index element={<ReviewOverviewPage />} />
          <Route path=":reviewFormCode" element={<ReviewOverviewPage />} />
        </Route>
      </Route>

      <Route path={PAGE_LIST.AUTHORIZE} element={<Authorize />} />
      <Route path={PAGE_LIST.LOGOUT} element={<Logout />} />
    </Routes>
  );
}

export default PageRoutes;
