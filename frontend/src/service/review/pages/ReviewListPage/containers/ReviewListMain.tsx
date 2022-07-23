import cn from 'classnames';

import { useGetReviewsQuery } from 'service/review/hooks/queries';

import Profile from 'service/review/components/Profile';
import QuestionContent from 'service/review/components/QuestionContent';
import Reaction from 'service/review/components/Reaction';

import imageAri from 'assets/images/ari.jpg';
import imageCompy from 'assets/images/compy.png';
import imageDom from 'assets/images/dom.png';
import imagePanda from 'assets/images/panda.jpg';
import imageProfile from 'assets/images/profile.png';
import imageRuna from 'assets/images/runa.jpg';
import imageSoju from 'assets/images/soju.png';

import styles from '../styles.module.scss';

function ReviewListMain({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const { data } = useGetReviewsQuery(reviewFormCode);

  const { reviews } = data;

  return (
    <div className={styles.participantContainer}>
      <section className={styles.articleContainer}>
        <div className={styles.title}>
          <h5>이 회고에 참여한 사람</h5>
        </div>

        <div className={styles.profileList}>
          <Profile image={imageDom} type="square" title="돔하디" description="오늘" />
          <Profile image={imageCompy} type="square" title="콤피" description="오늘" />
          <Profile image={imageAri} type="square" title="아리" description="오늘" />
          <Profile image={imageSoju} type="square" title="소주캉" description="오늘" />
          <Profile image={imageRuna} type="square" title="루나" description="오늘" />
          <Profile image={imagePanda} type="square" title="판다" description="오늘" />
          {/*  {reviews.map((review: any) => (
            <Profile key={review.reviewId} title={review.nickname} description="1일 전" />
          ))} */}
        </div>
      </section>

      {reviews.map((review: any) => (
        <section
          className={cn(styles.articleContainer, styles.postContainer)}
          key={review.reviewId}
        >
          <Profile
            key={review.reviewId}
            type="round"
            image={imageProfile}
            title={`${review.nickname}의 회고`}
            description="오늘, 1회 조회됨"
          />

          <hr />

          <QuestionContent questions={review.answers} />

          <hr />

          <Reaction />
        </section>
      ))}
    </div>
  );
}

export default ReviewListMain;
