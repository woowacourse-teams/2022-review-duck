import cn from 'classnames';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

function PopupBox({ className, fallback, children }: Props) {
  return (
    <div className={styles.container}>
      {fallback}

      <div className={styles.popupContainer}>
        <div className={cn(className, styles.childrenContainer)}>{children}</div>
      </div>
    </div>
  );
}

export default PopupBox;
