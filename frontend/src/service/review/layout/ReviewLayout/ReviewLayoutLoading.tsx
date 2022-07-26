import cn from 'classnames';

import { Logo } from 'common/components';

import Skeleton from 'common/components/Skeleton';

import styles from './styles.module.scss';

const ReviewLayoutLoading = () => {
  return (
    <>
      <div className={cn('flex-container column', styles.loadingContainer)}>
        <Logo />
        <Skeleton line={3} />
      </div>

      <div className={cn('flex-container column', styles.loadingContainer)}>
        <Skeleton line={4} />
      </div>
    </>
  );
};

export default ReviewLayoutLoading;
