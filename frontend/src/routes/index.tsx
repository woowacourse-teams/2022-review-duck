import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PAGE_LIST, PERMISSION } from 'constant';

import useAuth from 'service/hooks/useAuth';

import { UserAgentContext } from 'common/contexts/UserAgent';
import * as lazy from 'routes/lazy';
import Page from 'service/components/Page';
import MainLayout from 'service/layout/MainLayout';
import ReviewLayout from 'service/layout/ReviewLayout';
import ErrorPage from 'service/pages/ErrorPage';
import MainPage from 'service/pages/MainPage';

// ✅ 코드 가독성을 위해 Prettier 무시 처리
// prettier-ignore
function PageRoutes() {
  const { isPC } = useContext(UserAgentContext);
  const { isLogin } = useAuth();

  return (
    <Routes>
      {/* 메인 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route index element={<Page component={MainPage} />} />

        {/* 템플릿 영역 */}
        <Route
          path={PAGE_LIST.TEMPLATE_LIST}
          element={<Page title="템플릿 목록" component={lazy.TemplateListPage} />}
        />
        <Route
          path={`${PAGE_LIST.TEMPLATE_DETAIL}/:templateId`}
          element={<Page title="템플릿 조회" component={lazy.TemplateDetailPage} />}
        />
        <Route
          path={PAGE_LIST.TEMPLATE_FORM}
          element={<Page title="템플릿 생성" component={lazy.TemplateEditorPage} permission={PERMISSION.LOGIN_USER} />}
        />
        <Route
          path={`${PAGE_LIST.TEMPLATE_FORM}/:templateId`}
          element={<Page title="템플릿 편집" component={lazy.TemplateEditorPage} permission={PERMISSION.LOGIN_USER} />}
        />

        {/* 사용자 커뮤니티 영역 */}
        <Route
          path={PAGE_LIST.TIMELINE}
          element={<Page title="타임라인" component={lazy.ReviewTimelinePage} />}
        />
        <Route
          path={`${PAGE_LIST.USER_PROFILE}/:socialId`}
          element={<Page title="프로필 조회" component={lazy.UserProfilePage} permission={isPC ? PERMISSION.ALL : PERMISSION.LOGIN_USER} />}
        />
      </Route>

      {/* 회고 도메인 전용 레이아웃 */}
      <Route element={isPC ? <ReviewLayout /> : <MainLayout />}>
        <Route path={PAGE_LIST.REVIEW_FORM}>
          <Route
            index
            element={<Page title="회고 생성" component={lazy.ReviewFormEditorPage} permission={PERMISSION.LOGIN_USER} />}
          />
          <Route
            path=":reviewFormCode"
            element={<Page title="회고 편집" component={lazy.ReviewFormEditorPage} permission={PERMISSION.LOGIN_USER} />}
          />
        </Route>

        <Route path={PAGE_LIST.REVIEW}>
          <Route
            path=":reviewFormCode"
            element={<Page title="회고 작성" component={lazy.ReviewAnswerEditorPage} permission={PERMISSION.LOGIN_USER} />}
          />
          <Route
            path=":reviewFormCode/:reviewId"
            element={<Page title="나의 회고 편집" component={lazy.ReviewAnswerEditorPage} permission={PERMISSION.LOGIN_USER} />}
          />
        </Route>
      </Route>

      <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
        <Route
          path=":reviewFormCode"
          element={<Page title="회고 목록" component={lazy.ReviewOverviewPage} />}
        />
        <Route
          path=":reviewFormCode/:displayMode"
          element={<Page title="회고 목록" component={lazy.ReviewOverviewPage} />}
        />
      </Route>

      {/* 회원 관련 서비스 */}
      <Route
        path={PAGE_LIST.AUTHORIZE}
        element={<Page title="로그인" component={lazy.UserAuthorizePage} />}
      />
      <Route
        path={PAGE_LIST.LOGOUT}
        element={<Page title="로그아웃" component={lazy.UserLogoutPage} />}
      />

      {/* Etc */}
      <Route
        path="*"
        element={<ErrorPage status={404} title="찾을 수 없는 페이지입니다" description="not found" />}
      />
    </Routes>
  );
}

export default PageRoutes;
