import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

import ReviewLayoutLoading from './ReviewLayoutLoading';

function ReviewLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Suspense fallback={<ReviewLayoutLoading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default ReviewLayout;
