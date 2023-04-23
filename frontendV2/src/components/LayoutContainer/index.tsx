import cn from 'classnames';

import styles from './styles.module.scss';

interface LayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function LayoutContainer({ className, children, ...rest }: LayoutContainerProps) {
  return (
    <div className={cn(styles.container, className)} {...rest}>
      {children}
    </div>
  );
}

export default LayoutContainer;
