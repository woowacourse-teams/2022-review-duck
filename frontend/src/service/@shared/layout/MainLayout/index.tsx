import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from 'common/components';

import styles from './styles.module.scss';

import Header from './Header';
import ErrorPage from 'service/@shared/pages/ErrorPage';

function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <ErrorBoundary fallback={ErrorPage}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer></footer>
    </div>
  );
}

export default MainLayout;
