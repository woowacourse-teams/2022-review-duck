import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

function ReviewLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Suspense fallback={<p>TODO: 로딩 페이지 만들기</p>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default ReviewLayout;
