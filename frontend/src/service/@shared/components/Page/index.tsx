import React, { useEffect } from 'react';

import { PERMISSION, SERVICE_NAME } from 'constant';
import { useSetRecoilState } from 'recoil';

import RequireAuth, { RequireAuthProps } from '../RequireAuth';
import { pageTitleAtom } from 'recoil/pageTitle';

export interface PageTitleProps {
  title?: string;
  permission?: RequireAuthProps['permission'];
  component: React.ComponentType;
}

function Page({ title = '', permission = PERMISSION.ALL, component: Component }: PageTitleProps) {
  const setPageTitleAtom = useSetRecoilState(pageTitleAtom);

  useEffect(
    function updateDocumentTitle() {
      setPageTitleAtom(title || SERVICE_NAME);
      document.title = title ? `${title} - ${SERVICE_NAME}` : SERVICE_NAME;

      return () => {
        document.title = SERVICE_NAME;
      };
    },
    [title],
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
