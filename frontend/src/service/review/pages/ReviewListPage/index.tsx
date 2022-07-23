import { Suspense, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import cn from 'classnames';

import { useGetReviewsQuery } from 'service/review/hooks/queries';

import { Button, Icon, Logo } from 'common/components';

import Skeleton from 'common/components/Skeleton';

import styles from './styles.module.scss';

import ReviewHeader from './containers/ReviewHeader';
import ReviewListMain from './containers/ReviewListMain';
import ReviewSheetView from './containers/ReviewSheetView';
import ReviewSideMenu from './containers/ReviewSideMenu';
import { PAGE_LIST } from 'service/@shared/constants';

function ReviewListPage() {
  const navigate = useNavigate();
  const { reviewFormCode = '' } = useParams();

  const { isError, error }: any = useGetReviewsQuery(reviewFormCode, {
    suspense: false,
  });

  const [isSheetEnabled, setSheetEnabled] = useState(false);

  if (isError) {
    alert(error.message);
    navigate(-1);

    return <></>;
  }

  const onClickModeChange = (isEnabled: boolean) => () => {
    if (isEnabled === isSheetEnabled) return;

    setSheetEnabled(isEnabled);
  };

  /*
  const templateData = useQuery(
    ['questions', { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
    },
  );

  const { questions } = templateData.data; */

  return (
    <div className={cn(styles.layout)}>
      <header className={cn(styles.header)}>
        <div className={cn(styles.container, styles.menuBar)}>
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
        </div>
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

export default ReviewListPage;
