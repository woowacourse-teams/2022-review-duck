import { useRef } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';

import { useGetReviews } from 'service/review/hooks/queries';

import { Button, Icon, Text, TextBox } from 'common/components';

import styles from '../styles.module.scss';
import { PAGE_LIST } from 'service/@shared/constants';

function ReviewSideMenu({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const { data: reviewsData } = useGetReviews(reviewFormCode);
  const { reviews = [] } = reviewsData || {};

  const linkInputBox = useRef<HTMLInputElement>(null);

  const onClickCopyLink = async () => {
    const $copyLink = linkInputBox.current;

    if (!$copyLink) return;

    try {
      await navigator.clipboard.writeText($copyLink.value);
      alert('링크를 클립보드에 복사했습니다.');
    } catch (e) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <aside className={cn(styles.sideMenu, styles.participantContainer)}>
      <div className={styles.articleContainer}>
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

        <Link to={`${PAGE_LIST.REVIEW}/${reviewFormCode}`}>
          <Button className={styles.joinButton} theme="outlined">
            <Icon code="group_add"></Icon>이 회고에 참여하기
          </Button>
        </Link>

        <Text className={styles.smallTitle}>회고 링크</Text>

        <div className={styles.linkWrapper}>
          <TextBox
            ref={linkInputBox}
            className={styles.input}
            size="small"
            value={`${location.origin}/overview/${reviewFormCode}`}
            readOnly
          />

          <Text size={12} className={styles.button} onClick={onClickCopyLink}>
            복사
          </Text>
        </div>

        <section className="admin-review">
          <Text className={styles.smallTitle} size={14}>
            회고 관리
          </Text>

          <div className={styles.buttonContainer}>
            <Link to={`${PAGE_LIST.REVIEW_FORM}/${reviewFormCode}`}>
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

      <div className={styles.articleContainer}>
        <Text size={20} weight="bold">
          작성된 회고 목록
        </Text>
      </div>
    </aside>
  );
}

export default ReviewSideMenu;
