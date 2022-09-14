import { useEffect } from 'react';

import cn from 'classnames';
import { MODAL_LIST, PAGE_OPTION, TEMPLATE_TAB } from 'constant';
import { PAGE_LIST } from 'constant';
import { TemplateFilterType } from 'types';

import useModal from 'common/hooks/useModal';
import { useGetTemplates } from 'service/@shared/hooks/queries/template';

import { Button, Icon, Text, TransitionDiv } from 'common/components';

import ScrollPanel from 'common/components/ScrollPanel';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import QuestionCard from 'service/@shared/components/QuestionCard';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

function MainPage() {
  const { showModal } = useModal();
  const onClickReviewStart = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };
  const { data, isError, error } = useGetTemplates(
    TEMPLATE_TAB.TREND as TemplateFilterType,
    String(1),
    PAGE_OPTION.TEMPLATE_TREND_ITEM_SIZE,
  );
  const { templates } = data || { templates: [] };

  useEffect(() => {
    if (isError) {
      alert(error.message);
    }
  }, [isError, error]);

  return (
    <>
      <section className={styles.background}>
        <LayoutContainer className={styles.introContainer}>
          <div className={styles.leftContainer}>
            <Text className={styles.title} size={40}>
              <span className={styles.bold}>회고덕</span>으로 함께 회고를 시작해보세요
            </Text>

            <Text className={styles.subTitle} size={16}>
              함께 성장하는 회고 플랫폼
            </Text>

            <Button
              className={styles.button}
              theme="outlined"
              size="medium"
              onClick={onClickReviewStart}
            >
              <Icon code="rate_review" />
              회고 시작하기
            </Button>
          </div>

          <div className={styles.rightContainer}>
            <TransitionDiv
              className={styles.decorative}
              duration={400}
              appear="drop"
              direction="up"
            >
              <QuestionCard
                className={cn(styles.question, styles.small)}
                numbering={1}
                title="오늘의 체크인 점수는 몇점인가요?"
                description="1점에서 10점까지 숫자로 입력해주세요."
              />
            </TransitionDiv>

            <TransitionDiv
              className={styles.decorative}
              duration={600}
              appear="drop"
              direction="down"
            >
              <QuestionCard
                className={styles.question}
                numbering={2}
                title="이번 프로젝트에서 배운 점은 무엇인가요?"
                description="200자 이내로 간단하게 작성해주세요."
              />
            </TransitionDiv>

            <TransitionDiv
              className={styles.decorative}
              duration={800}
              appear="drop"
              direction="right"
            >
              <QuestionCard
                className={cn(styles.question, styles.medium)}
                numbering={3}
                title="개선할 수 있는 점은 무엇이 있을까요?"
                description="개선을 위해 어떤 노력을 할 수 있을지 생각해봐요."
              />
            </TransitionDiv>
          </div>
        </LayoutContainer>
      </section>

      <LayoutContainer className={styles.contentHeader}>
        <Text size={24} element="h1">
          인기 템플릿
        </Text>
      </LayoutContainer>

      <ScrollPanel className={styles.cardList}>
        {templates.map((template) => (
          <TemplateCard
            key={template.info.id}
            className={styles.mainCard}
            link={`${PAGE_LIST.TEMPLATE_DETAIL}/${template.info.id}`}
          >
            <TemplateCard.Tag usedCount={template.info.usedCount} />
            <TemplateCard.Title title={template.info.title} />
            <TemplateCard.UpdatedAt updatedAt={template.info.updatedAt} />
            <TemplateCard.Description description={template.info.description} />

            <TemplateCard.Profile
              profileUrl={template.creator.profileUrl}
              nickname={template.creator.nickname}
              socialNickname={template.creator.socialNickname || ''}
            />
          </TemplateCard>
        ))}
      </ScrollPanel>

      <div className={styles.temp}></div>
    </>
  );
}

export default MainPage;
