import { Routes, Route } from 'react-router-dom';

import useAuth from 'service/@shared/hooks/useAuth';

import RequireAuth from 'service/@shared/components/RequireAuth';

import { PAGE_LIST } from 'service/@shared/constants';
import MainLayout from 'service/@shared/layout/MainLayout';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import Playground from 'service/review/pages/Playground';
import ReviewAnswerEditorPage from 'service/review/pages/ReviewAnswerEditorPage';
import ReviewFormEditorPage from 'service/review/pages/ReviewFormEditorPage';
import ReviewOverviewPage from 'service/review/pages/ReviewOverviewPage';
import TemplateDetailPage from 'service/template/pages/TemplateDetailPage';
import TemplateListPage from 'service/template/pages/TemplateListPage';
import Authorize from 'service/user/pages/Authorize';
import Logout from 'service/user/pages/Logout';
import MainPage from 'service/user/pages/MainPage';
import MyPage from 'service/user/pages/MyPage';

function PageRoutes() {
  useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<MainPage />} />

        <Route element={<RequireAuth />}>
          <Route path={PAGE_LIST.MY_PAGE} element={<MyPage />} />
        </Route>

        <Route path={PAGE_LIST.TEMPLATE_LIST} element={<TemplateListPage />} />

        <Route path={`${PAGE_LIST.TEMPLATE_DETAIL}/:templateId`} element={<TemplateDetailPage />} />
        <Route path="playground" element={<Playground />} />
      </Route>

      <Route element={<ReviewLayout />}>
        <Route element={<RequireAuth />}>
          <Route>
            <Route path={PAGE_LIST.REVIEW}>
              <Route index element={<ReviewAnswerEditorPage />} />
              <Route path=":reviewFormCode" element={<ReviewAnswerEditorPage />} />
              <Route path=":reviewFormCode/:reviewId" element={<ReviewAnswerEditorPage />} />
            </Route>
          </Route>

          <Route path={PAGE_LIST.REVIEW_FORM}>
            <Route index element={<ReviewFormEditorPage />} />
            <Route path=":reviewFormCode" element={<ReviewFormEditorPage />} />
          </Route>
        </Route>
      </Route>

      <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
        <Route index element={<ReviewOverviewPage />} />
        <Route path=":reviewFormCode" element={<ReviewOverviewPage />} />
        <Route path=":reviewFormCode/:displayMode" element={<ReviewOverviewPage />} />
      </Route>

      <Route path={PAGE_LIST.AUTHORIZE} element={<Authorize />} />
      <Route path={PAGE_LIST.LOGOUT} element={<Logout />} />
    </Routes>
  );
}

export default PageRoutes;
