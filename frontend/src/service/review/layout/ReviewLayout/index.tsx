import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Logo } from 'common/components';

import Skeleton from 'common/components/Skeleton';

import styles from './styles.module.scss';

function ReviewLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Suspense
          fallback={
            <>
              <div className="flex-container column" style={{ gap: '2rem' }}>
                <Logo />
                <Skeleton line={3} />
              </div>

              <div className="flex-container column" style={{ gap: '2rem' }}>
                <Skeleton line={4} />
              </div>
            </>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default ReviewLayout;
