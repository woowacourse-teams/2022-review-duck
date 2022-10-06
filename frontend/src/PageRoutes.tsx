import { Routes, Route } from 'react-router-dom';

import { PAGE_LIST } from 'constant';
import * as SplitPages from 'routes';

import useAuth from 'service/@shared/hooks/useAuth';

import RequireAuth from 'service/@shared/components/RequireAuth';

import MainLayout from 'service/@shared/layout/MainLayout';
import ErrorPage from 'service/@shared/pages/ErrorPage';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import Playground from 'service/review/pages/Playground';
import MainPage from 'service/user/pages/MainPage';

function PageRoutes() {
  useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<MainPage />} />

        <Route path={`${PAGE_LIST.USER_PROFILE}/:socialId`} element={<SplitPages.ProfilePage />} />
        <Route path={PAGE_LIST.TIMELINE} element={<SplitPages.ReviewTimelinePage />} />
        <Route path="playground" element={<Playground />} />

        <Route path={PAGE_LIST.TEMPLATE_LIST} element={<SplitPages.TemplateListPage />} />
        <Route
          path={`${PAGE_LIST.TEMPLATE_DETAIL}/:templateId`}
          element={<SplitPages.TemplateDetailPage />}
        />

        <Route element={<RequireAuth />}>
          <Route path={PAGE_LIST.TEMPLATE_FORM} element={<SplitPages.TemplateEditorPage />} />
          <Route
            path={`${PAGE_LIST.TEMPLATE_FORM}/:templateId`}
            element={<SplitPages.TemplateEditorPage />}
          />
        </Route>

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
              <Route index element={<SplitPages.ReviewAnswerEditorPage />} />
              <Route path=":reviewFormCode" element={<SplitPages.ReviewAnswerEditorPage />} />
              <Route
                path=":reviewFormCode/:reviewId"
                element={<SplitPages.ReviewAnswerEditorPage />}
              />
            </Route>
          </Route>

          <Route path={PAGE_LIST.REVIEW_FORM}>
            <Route index element={<SplitPages.ReviewFormEditorPage />} />
            <Route path=":" element={<SplitPages.ReviewFormEditorPage />} />
          </Route>
        </Route>
      </Route>

      <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
        <Route index element={<SplitPages.ReviewOverviewPage />} />
        <Route path=":reviewFormCode" element={<SplitPages.ReviewOverviewPage />} />
        <Route path=":reviewFormCode/:displayMode" element={<SplitPages.ReviewOverviewPage />} />
      </Route>

      <Route path={PAGE_LIST.AUTHORIZE} element={<SplitPages.AuthorizePage />} />
      <Route path={PAGE_LIST.LOGOUT} element={<SplitPages.LogoutPage />} />

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
