import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import styles from './styles.module.scss';

import Header from './Header';
import ErrorPage from 'service/@shared/pages/ErrorPage';

function MainLayout() {
  return (
    <div className={styles.layoutMain}>
      <Header />

      <main className={styles.main}>
        <ErrorBoundary fallback={ErrorPage}>
          <Suspense>
            <PageSuspense.Provider>
              <Outlet />
            </PageSuspense.Provider>
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer></footer>
    </div>
  );
}

export default MainLayout;
