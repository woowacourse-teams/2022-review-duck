import React from 'react';

export const ReviewFormEditorPage = React.lazy(() => import('service/pages/ReviewFormEditorPage'));

export const ReviewAnswerEditorPage = React.lazy(
  () => import('service/pages/ReviewAnswerEditorPage'),
);

export const ReviewOverviewPage = React.lazy(() => import('service/pages/ReviewOverviewPage'));

export const ReviewTimelinePage = React.lazy(() => import('service/pages/ReviewTimelinePage'));

export const TemplateDetailPage = React.lazy(() => import('service/pages/TemplateDetailPage'));

export const TemplateEditorPage = React.lazy(() => import('service/pages/TemplateEditorPage'));

export const TemplateListPage = React.lazy(() => import('service/pages/TemplateListPage'));

export const UserAuthorizePage = React.lazy(() => import('service/pages/UserAuthorizePage'));

export const UserLogoutPage = React.lazy(() => import('service/pages/UserLogoutPage'));

export const UserProfilePage = React.lazy(() => import('service/pages/UserProfilePage'));
