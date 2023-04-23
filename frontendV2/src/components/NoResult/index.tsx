import cn from 'classnames';

import { Logo } from 'common/components';

import styles from './styles.module.scss';

interface NoResultProps {
  className?: string;
  size: 'small' | 'medium' | 'large';
  children: string;
}

function NoResult({ className, size, children }: NoResultProps) {
  return (
    <div className={cn(className, styles.container)}>
      <Logo className={styles.logo} theme="border" size={size} weight="normal" />
      <span className={cn(styles[size], styles.title)}>{children}</span>
    </div>
  );
}

NoResult.defaultProps = {
  size: 'medium',
  children: '결과가 없습니다.',
};

export default NoResult;
