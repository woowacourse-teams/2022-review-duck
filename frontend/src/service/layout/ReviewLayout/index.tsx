import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { FlexContainer, Logo } from 'common/components';
import Skeleton from 'common/components/Skeleton';

import styles from './styles.module.scss';

function ReviewLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Suspense
          fallback={
            <>
              <FlexContainer direction="column" gap="large">
                <Logo />
                <Skeleton line={3} />
              </FlexContainer>

              <FlexContainer direction="column" gap="large">
                <Skeleton line={4} />
              </FlexContainer>
            </>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default ReviewLayout;
