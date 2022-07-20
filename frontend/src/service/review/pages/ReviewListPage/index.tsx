import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';

import cn from 'classnames';

import { Button, Icon, Text, Logo, FieldSet, TextBox } from 'common/components';

import Profile from 'service/review/components/Profile';
import QuestionContent from 'service/review/components/QuestionContent';
import Reaction from 'service/review/components/Reaction';

import dom from 'assets/images/dom.png';

import styles from './styles.module.scss';

import reviewAPI from 'service/review/api';

function ReviewListPage() {
  const { reviewFormCode } = useParams();

  const { data } = useQuery(['getReviews'], () => reviewAPI.getReviews(reviewFormCode), {
    suspense: true,
    useErrorBoundary: false,
  });

  const templateData = useQuery(
    ['questions', { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
    },
  );

  const { reviewFormTitle, reviews } = data;

  const { questions } = templateData.data;

  return (
    <div className={cn(styles.layout)}>
      <header className={cn(styles.header)}>
        <div className={cn(styles.container, styles.menuBar)}>
          <div className={styles.leftContainer}>
            <Logo size="small" />

            <div className={styles.reviewFormInfo}>
              <h4 className={styles.title}>{reviewFormTitle}</h4>
              <Text className={styles.creator} size={14}>
                크리에이터 : 건어물 가게 주인장
              </Text>
            </div>
          </div>

          <div className={styles.rightContainer}>
            <Button>
              <Icon code="list" />
              <span>목록형 보기</span>
            </Button>

            <Button theme="outlined">
              <Icon code="table_view" />
              <span>시트형 보기</span>
            </Button>
          </div>
        </div>
      </header>

      <main className={cn(styles.container, styles.content)}>
        <div>
          <section className={styles.contentContainer}>
            <div className={styles.title}>
              <h5>이 회고에 참여한 사람</h5>
            </div>

            <div className={styles.profileList}>
              {reviews.map((review: any) => (
                <Profile key={review.reviewId} title={review.nickname} description="1일 전" />
              ))}
            </div>
          </section>

          {reviews.map((review: any) => (
            <section
              className={cn(styles.contentContainer, styles.postContainer)}
              key={review.reviewId}
            >
              <Profile
                key={review.reviewId}
                type="round"
                title={`${review.nickname}의 회고`}
                description="1일 전, 53번 조회됨"
              />

              <hr />

              <QuestionContent questions={review.answers} />

              <hr />

              <Reaction />
            </section>
          ))}
        </div>
        <div className={styles.sideMenu}>
          <div className={styles.contentContainer}>
            <Text className={styles.infoTitle} size={20} weight="bold">
              회고 정보
            </Text>
            <div className={styles.infoContent}>
              <div className={styles.wrapper}>
                <Text className={cn(styles.text, styles.label)} size={14} weight="lighter">
                  크리에이터
                </Text>
                <Text className={styles.text} size={14} weight="lighter">
                  건어물 가게 주인장
                </Text>
              </div>
              <div className={styles.wrapper}>
                <Text className={cn(styles.text, styles.label)} size={14} weight="lighter">
                  회고 참여자
                </Text>
                <Text className={styles.text} size={14} weight="lighter">
                  {`총 ${reviews.length}명이 참여함`}
                </Text>
              </div>
              <div className={styles.wrapper}>
                <Text className={cn(styles.text, styles.label)} size={14} weight="lighter">
                  업데이트
                </Text>
                <Text className={styles.text} size={14} weight="lighter">
                  3일 전 업데이트 됨
                </Text>
              </div>
            </div>
            <Link to={`/review/submit/${reviewFormCode}`}>
              <Button className={styles.joinButton} size="small" theme="outlined">
                <Icon code="group_add"></Icon>이 회고에 참여하기
              </Button>
            </Link>
            <Text className={styles.smallTitle}>회고 링크</Text>
            <div className={styles.linkWrapper}>
              <TextBox
                className={styles.input}
                size="small"
                value="http://회고덕.com/Q1W2E3R4"
                readOnly
              ></TextBox>
              <Text size={12} className={styles.button}>
                복사
              </Text>
            </div>
            <section className="admin-review">
              <Text className={styles.smallTitle} size={14}>
                회고 관리
              </Text>
              <div className={styles.buttonContainer}>
                <Link to={`/review-forms/${reviewFormCode}`}>
                  <Button size="small">
                    <Icon code="edit_note"></Icon>
                    질문 수정
                  </Button>
                </Link>

                <Button theme="outlined" size="small">
                  <Icon code="share"></Icon>
                  템플릿 공유
                </Button>
              </div>
            </section>
          </div>
          <div className={styles.contentContainer}>
            <Text size={20} weight="bold">
              작성된 회고 목록
            </Text>
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export default ReviewListPage;
