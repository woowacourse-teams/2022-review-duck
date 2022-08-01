import { Suspense, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import cn from 'classnames';

import { Button, Icon, Logo } from 'common/components';

import Skeleton from 'common/components/Skeleton';

import styles from './styles.module.scss';

import ReviewHeader from './containers/ReviewHeader';
import ReviewListMain from './containers/ReviewListMain';
import ReviewSheetView from './containers/ReviewSheetView';
import ReviewSideMenu from './containers/ReviewSideMenu';
import { PAGE_LIST } from 'service/@shared/constants';

function ReviewOverviewPage() {
  const { reviewFormCode = '' } = useParams();

  const [isSheetEnabled, setSheetEnabled] = useState(false);

  const onClickModeChange = (isEnabled: boolean) => () => {
    if (isEnabled === isSheetEnabled) return;

    setSheetEnabled(isEnabled);
  };

  return (
    <div className={cn(styles.layout)}>
      <header className={cn(styles.header)}>
        <nav className={cn(styles.container, styles.menuBar)}>
          <div className={styles.leftContainer}>
            <Link to={PAGE_LIST.HOME}>
              <Logo size="small" />
            </Link>

            <Suspense fallback={<Skeleton />}>
              <ReviewHeader reviewFormCode={reviewFormCode} />
            </Suspense>
          </div>

          <div className={styles.rightContainer}>
            <Button
              theme={!isSheetEnabled ? 'default' : 'outlined'}
              onClick={onClickModeChange(false)}
            >
              <Icon code="list" />
              <span>목록형 보기</span>
            </Button>

            <Button
              theme={isSheetEnabled ? 'default' : 'outlined'}
              onClick={onClickModeChange(true)}
            >
              <Icon code="table_view" />
              <span>시트형 보기</span>
            </Button>
          </div>
        </nav>
      </header>

      {isSheetEnabled && (
        <Suspense fallback={<Skeleton line={4} />}>
          <ReviewSheetView reviewFormCode={reviewFormCode} />
        </Suspense>
      )}

      {!isSheetEnabled && (
        <main className={cn(styles.container, styles.content)}>
          <Suspense fallback={<Skeleton line={4} />}>
            <ReviewListMain reviewFormCode={reviewFormCode} />
          </Suspense>

          <Suspense fallback={<Skeleton line={3} />}>
            <ReviewSideMenu reviewFormCode={reviewFormCode} />
          </Suspense>
        </main>
      )}

      <footer></footer>
    </div>
  );
}

export default ReviewOverviewPage;
