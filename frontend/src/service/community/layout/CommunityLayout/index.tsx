import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

import Header from './Header';

function CommunityLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
}

export default CommunityLayout;
