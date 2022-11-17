import React, { useEffect } from 'react';

import { useSetRecoilState } from 'recoil';
import { pageTitleAtom } from 'recoil/pageTitle';

import usePageTitle from 'common/hooks/usePageTitle';

import { PERMISSION, SERVICE_NAME } from 'constant';

import RequireAuth, { RequireAuthProps } from '../RequireAuth';

export interface PageTitleProps {
  title?: string;
  permission?: RequireAuthProps['permission'];
  component: React.ComponentType;
}

function Page({ title = '', permission = PERMISSION.ALL, component: Component }: PageTitleProps) {
  const pageTitle = usePageTitle(title, SERVICE_NAME);
  const setPageTitleAtom = useSetRecoilState(pageTitleAtom);

  useEffect(
    function updateGlobalTitle() {
      setPageTitleAtom(pageTitle);
    },
    [pageTitle],
  );

  const renderComponent = permission ? (
    <RequireAuth permission={permission}>
      <Component />
    </RequireAuth>
  ) : (
    <Component />
  );

  return renderComponent;
}

export default Page;
