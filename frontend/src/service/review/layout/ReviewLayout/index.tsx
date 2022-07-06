import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
}

function ReviewLayout({ children }: Props) {
  return (
    <div className={styles.background}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}

export default ReviewLayout;
