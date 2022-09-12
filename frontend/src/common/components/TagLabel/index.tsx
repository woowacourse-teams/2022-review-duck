import { ReactNode } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

interface TagLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

function TagLabel({ className, children, ...rest }: TagLabelProps) {
  return (
    <div className={cn(className, styles.tag)} {...rest}>
      <div className={styles.tagWrapper}>{children}</div>
    </div>
  );
}

export default TagLabel;
