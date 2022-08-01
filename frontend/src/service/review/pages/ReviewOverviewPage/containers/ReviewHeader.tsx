import { useNavigate } from 'react-router-dom';

import { useGetReviewForm } from 'service/review/hooks/queries';

import { Text } from 'common/components';

import styles from '../styles.module.scss';

function ReviewHeader({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const navigate = useNavigate();
  const { data, isError, error } = useGetReviewForm(reviewFormCode);
  const { reviewTitle, creator } = data || {};

  // if (isError) {
  //   alert(error.message);
  //   navigate(-1);

  //   return <></>;
  // }

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
