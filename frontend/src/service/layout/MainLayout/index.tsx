import { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { faHome, faUser, faCompass, faRocket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PAGE_LIST } from 'constant';

import useAuth from 'service/hooks/useAuth';

import { ErrorBoundary } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import styles from './styles.module.scss';

import Header from './Header';
import MobileHeader from './view/MobileHeader';
import MobileMenu from './view/MobileMenubar';
import { UserAgentContext } from 'common/contexts/UserAgent';
import ErrorPage from 'service/pages/ErrorPage';

function MainLayout() {
  const { getUserProfileQuery } = useAuth();
  const { isMobile } = useContext(UserAgentContext);

  const { socialId } = getUserProfileQuery.data || {};

  return (
    <div className={styles.layoutMain}>
      <Header />

      {isMobile && <MobileHeader />}

      <main className={styles.main}>
        <ErrorBoundary fallback={ErrorPage}>
          <Suspense>
            <PageSuspense.Provider>
              <Outlet />
            </PageSuspense.Provider>
          </Suspense>
        </ErrorBoundary>
      </main>

      {isMobile && (
        <MobileMenu>
          <MobileMenu.Item route={PAGE_LIST.HOME}>
            <FontAwesomeIcon icon={faHome} />
          </MobileMenu.Item>

          <MobileMenu.Item route={PAGE_LIST.TEMPLATE_LIST}>
            <FontAwesomeIcon icon={faRocket} />
          </MobileMenu.Item>

          <MobileMenu.Item route={PAGE_LIST.TIMELINE}>
            <FontAwesomeIcon icon={faCompass} />
          </MobileMenu.Item>

          <MobileMenu.Item route={`${PAGE_LIST.USER_PROFILE}/${socialId}`}>
            <FontAwesomeIcon icon={faUser} />
          </MobileMenu.Item>
        </MobileMenu>
      )}
    </div>
  );
}

export default MainLayout;
