import cn from 'classnames';

import styles from './styles.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function LayoutContainer({ className, children, ...rest }: Props) {
  return (
    <div className={cn(styles.container, className)} {...rest}>
      {children}
    </div>
  );
}

export default LayoutContainer;
