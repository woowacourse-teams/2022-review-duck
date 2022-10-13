import React from 'react';

export const ReviewFormEditorPage = React.lazy(
  () => import('service/review/pages/ReviewFormEditorPage'),
);

export const ReviewAnswerEditorPage = React.lazy(
  () => import('service/review/pages/ReviewAnswerEditorPage'),
);

export const ReviewOverviewPage = React.lazy(
  () => import('service/review/pages/ReviewOverviewPage'),
);

export const ReviewTimelinePage = React.lazy(
  () => import('service/review/pages/ReviewTimelinePage'),
);

export const TemplateDetailPage = React.lazy(
  () => import('service/template/pages/TemplateDetailPage'),
);

export const TemplateEditorPage = React.lazy(
  () => import('service/template/pages/TemplateEditorPage'),
);

export const TemplateListPage = React.lazy(() => import('service/template/pages/TemplateListPage'));

export const AuthorizePage = React.lazy(() => import('service/user/pages/Authorize'));

export const LogoutPage = React.lazy(() => import('service/user/pages/Logout'));

export const ProfilePage = React.lazy(() => import('service/user/pages/ProfilePage'));
