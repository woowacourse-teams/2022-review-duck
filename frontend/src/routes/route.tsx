import { RouteObject } from 'react-router-dom';

import { PAGE_LIST, PERMISSION } from 'constant';

import Page from 'service/@shared/components/Page';

import * as lazy from './';
import MainLayout from 'service/@shared/layout/MainLayout';
import ErrorPage from 'service/@shared/pages/ErrorPage';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import MainPage from 'service/user/pages/MainPage';

const mainRoute: RouteObject[] = [
  { index: true, element: <Page component={MainPage} /> },
  {
    path: PAGE_LIST.TEMPLATE_LIST,
    element: <Page title="템플릿 목록" component={lazy.TemplateListPage} />,
  },
  {
    path: `${PAGE_LIST.TEMPLATE_DETAIL}/:templateId`,
    element: <Page title="템플릿 조회" component={lazy.TemplateDetailPage} />,
  },
  {
    path: PAGE_LIST.TEMPLATE_FORM,
    element: (
      <Page
        title="템플릿 생성"
        permission={PERMISSION.LOGIN_USER}
        component={lazy.TemplateEditorPage}
      />
    ),
  },
  {
    path: `${PAGE_LIST.TEMPLATE_FORM}/:templateId`,
    element: (
      <Page
        title="템플릿 편집"
        permission={PERMISSION.LOGIN_USER}
        component={lazy.TemplateEditorPage}
      />
    ),
  },
  {
    path: PAGE_LIST.TEMPLATE_FORM,
    element: (
      <Page
        title="템플릿 편집"
        permission={PERMISSION.LOGIN_USER}
        component={lazy.TemplateListPage}
      />
    ),
  },
  {
    path: PAGE_LIST.TIMELINE,
    element: <Page title="타임라인" component={lazy.ReviewTimelinePage} />,
  },
  {
    path: `${PAGE_LIST.USER_PROFILE}/:socialId`,
    element: <Page title="프로필 조회" component={lazy.ProfilePage} />,
  },
];

const reviewRoute = [
  {
    path: PAGE_LIST.REVIEW_FORM,
    children: [
      {
        index: true,
        element: (
          <Page
            title="회고 생성"
            permission={PERMISSION.LOGIN_USER}
            component={lazy.ReviewFormEditorPage}
          />
        ),
      },
      {
        path: ':reviewFormCode',
        element: (
          <Page
            title="회고 편집"
            permission={PERMISSION.LOGIN_USER}
            component={lazy.ReviewFormEditorPage}
          />
        ),
      },
    ],
  },
  {
    path: PAGE_LIST.REVIEW,
    children: [
      {
        path: ':reviewFormCode',
        element: <Page title="회고글 작성" component={lazy.ReviewAnswerEditorPage} />,
      },
      {
        path: ':reviewFormCode/:reviewId',
        element: <Page title="나의 회고글 편집" component={lazy.ReviewAnswerEditorPage} />,
      },
    ],
  },
];

const ROUTES: RouteObject[] = [
  {
    element: <MainLayout />,
    children: mainRoute,
  },
  {
    element: <ReviewLayout />,
    children: reviewRoute,
  },
  {
    path: PAGE_LIST.REVIEW_OVERVIEW,
    children: [
      {
        path: ':reviewFormCode',
        element: <Page title="회고 목록" component={lazy.ReviewOverviewPage} />,
      },
      {
        path: ':reviewFormCode/:displayMode',
        element: <Page title="회고 시트 조회" component={lazy.ReviewOverviewPage} />,
      },
    ],
  },
  {
    path: PAGE_LIST.AUTHORIZE,
    element: <Page title="로그인" component={lazy.AuthorizePage} />,
  },
  {
    path: PAGE_LIST.LOGOUT,
    element: <Page title="로그아웃" component={lazy.LogoutPage} />,
  },
  {
    path: '*',
    element: <ErrorPage status={404} title="찾을 수 없는 페이지입니다" description="not found" />,
  },
];

export default ROUTES;
