import { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import {
  faCopy,
  faHome,
  faComments,
  faUser,
  faBookBookmark,
  faPenToSquare,
  faClone,
  faPaste,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PAGE_LIST } from 'constant';

import useAuth from 'service/@shared/hooks/useAuth';

import { ErrorBoundary, Text } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import styles from './styles.module.scss';

import Header from './Header';
import MobileMenu from './view/MobileMenubar';
import { UserAgentContext } from 'common/contexts/UserAgent';
import ErrorPage from 'service/@shared/pages/ErrorPage';

function MainLayout() {
  const { getUserProfileQuery } = useAuth();
  const { isMobile } = useContext(UserAgentContext);
  const { socialId } = getUserProfileQuery.data || {};

  return (
    <div className={styles.layoutMain}>
      <Header />

      {isMobile && (
        <Text as="h1" className={styles.pageTitle} weight="bold">
          반가워요! 덕회고님 👋
        </Text>
      )}

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
            <FontAwesomeIcon icon={faCopy} />
          </MobileMenu.Item>

          <MobileMenu.Item route={PAGE_LIST.TIMELINE}>
            <FontAwesomeIcon icon={faComments} />
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
