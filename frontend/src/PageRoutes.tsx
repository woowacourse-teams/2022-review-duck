import { Routes, Route } from 'react-router-dom';

import { PAGE_LIST } from 'constant';

import useAuth from 'service/@shared/hooks/useAuth';

import RequireAuth from 'service/@shared/components/RequireAuth';

import MainLayout from 'service/@shared/layout/MainLayout';
import ErrorPage from 'service/@shared/pages/ErrorPage';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import Playground from 'service/review/pages/Playground';
import ReviewAnswerEditorPage from 'service/review/pages/ReviewAnswerEditorPage';
import ReviewFormEditorPage from 'service/review/pages/ReviewFormEditorPage';
import ReviewOverviewPage from 'service/review/pages/ReviewOverviewPage';
import ReviewTimelinePage from 'service/review/pages/ReviewTimelinePage';
import TemplateDetailPage from 'service/template/pages/TemplateDetailPage';
import TemplateFormEditorPage from 'service/template/pages/TemplateFormEditorPage';
import TemplateListPage from 'service/template/pages/TemplateListPage';
import Authorize from 'service/user/pages/Authorize';
import Logout from 'service/user/pages/Logout';
import MainPage from 'service/user/pages/MainPage';
import ProfilePage from 'service/user/pages/ProfilePage';

function PageRoutes() {
  useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<MainPage />} />

        <Route path={PAGE_LIST.TEMPLATE_LIST} element={<TemplateListPage />} />

        <Route path={`${PAGE_LIST.TEMPLATE_DETAIL}/:templateId`} element={<TemplateDetailPage />} />

        <Route path="/profile/:socialId" element={<ProfilePage />} />
        <Route path={PAGE_LIST.TIMELINE} element={<ReviewTimelinePage />} />
        <Route path="playground" element={<Playground />} />

        {/* 데모 데이용 */}
        <Route
          path="/pending"
          element={<ErrorPage status="!" title="준비 중인 서비스입니다." description="pending" />}
        />
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

          <Route path={PAGE_LIST.TEMPLATE_FORM} element={<TemplateFormEditorPage />} />
        </Route>
      </Route>

      <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
        <Route index element={<ReviewOverviewPage />} />
        <Route path=":reviewFormCode" element={<ReviewOverviewPage />} />
        <Route path=":reviewFormCode/:displayMode" element={<ReviewOverviewPage />} />
      </Route>

      <Route path={PAGE_LIST.AUTHORIZE} element={<Authorize />} />
      <Route path={PAGE_LIST.LOGOUT} element={<Logout />} />

      <Route
        path="*"
        element={
          <ErrorPage
            status={404}
            title="찾을 수 없는 페이지입니다"
            description="not found
          "
          />
        }
      />
    </Routes>
  );
}

export default PageRoutes;
