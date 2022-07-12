import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

function ReviewLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
}

export default ReviewLayout;
