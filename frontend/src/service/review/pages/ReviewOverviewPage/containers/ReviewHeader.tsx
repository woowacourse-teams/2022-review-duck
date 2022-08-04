import { Text } from 'common/components';

import styles from '../styles.module.scss';
import useOverviewQueries from '../useOverviewQueries';

function ReviewHeader({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const { reviewForm } = useOverviewQueries(reviewFormCode);

  const { reviewTitle, creator } = reviewForm || {};

  return (
    <div className={styles.reviewFormInfo}>
      <h4 className={styles.title}>{reviewTitle}</h4>
      <Text className={styles.creator} size={14}>
        크리에이터 : {creator?.nickname}
      </Text>
    </div>
  );
}

export default ReviewHeader;
