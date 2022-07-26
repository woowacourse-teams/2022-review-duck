import { useGetReviews } from 'service/review/hooks/queries';

import { Text } from 'common/components';

import styles from '../styles.module.scss';

function ReviewHeader({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const { data } = useGetReviews(reviewFormCode);
  const { reviewFormTitle } = data || {};

  return (
    <div className={styles.reviewFormInfo}>
      <h4 className={styles.title}>{reviewFormTitle}</h4>
      <Text className={styles.creator} size={14}>
        크리에이터 : 건어물 가게 주인장
      </Text>
    </div>
  );
}

export default ReviewHeader;
