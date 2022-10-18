import { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { faCopy, faHome, faComments, faUser } from '@fortawesome/free-solid-svg-icons';

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

      <Text as="h1" className={styles.pageTitle} weight="bold">
        반가워요! 덕회고님 👋
      </Text>

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
          <MobileMenu.Item icon={faHome} route={PAGE_LIST.HOME}>
            홈
          </MobileMenu.Item>

          <MobileMenu.Item icon={faCopy} route={PAGE_LIST.TEMPLATE_LIST}>
            템플릿
          </MobileMenu.Item>

          <MobileMenu.Item icon={faComments} route={PAGE_LIST.TIMELINE}>
            타임라인
          </MobileMenu.Item>

          <MobileMenu.Item icon={faUser} route={`${PAGE_LIST.USER_PROFILE}/${socialId}`}>
            프로필
          </MobileMenu.Item>
        </MobileMenu>
      )}
    </div>
  );
}

export default MainLayout;
