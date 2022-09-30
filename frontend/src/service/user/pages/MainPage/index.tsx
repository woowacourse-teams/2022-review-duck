import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { MODAL_LIST, PAGE_OPTION, FILTER } from 'constant';
import { TemplateFilterType } from 'types';

import useModal from 'common/hooks/useModal';
import { useGetTemplates } from 'service/@shared/hooks/queries/template';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Button, Text, TransitionDiv } from 'common/components';

import ScrollPanel from 'common/components/ScrollPanel';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import QuestionCard from 'service/@shared/components/QuestionCard';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import { Intro } from './view/Intro';
import { TrendTemplate } from './view/TrendTemplate';

function MainPage() {
  const { showModal } = useModal();
  const navigate = useNavigate();

  const { data, isError, error } = useGetTemplates(
    FILTER.TEMPLATE_TAB.TREND as TemplateFilterType,
    String(1),
    PAGE_OPTION.TEMPLATE_TREND_ITEM_SIZE,
  );

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { templates } = data;

  const handleClickReviewStart = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };

  const handleClickTemplateCard = (templateId: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`);
  };

  return (
    <FlexContainer className={styles.mainPageContainer}>
      <Intro>
        <div className={styles.leftContainer}>
          <Intro.Title>
            <span className={styles.bold}>회고덕</span>으로 함께 회고를 시작해보세요
          </Intro.Title>
          <Intro.SubTitle>함께 성장하는 회고 플랫폼</Intro.SubTitle>
          <Intro.ReviewButton onClick={handleClickReviewStart}>회고 시작하기</Intro.ReviewButton>
        </div>
        <Intro.HeroCards />
      </Intro>

<<<<<<< HEAD
            <Text className={styles.subTitle} size={16}>
              함께 성장하는 회고 플랫폼
            </Text>

            <Button
              className={styles.button}
              theme="outlined"
              size="medium"
              onClick={handleClickReviewStart}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
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
        <Text as="h1" size={20} weight="bold">
          인기 템플릿
        </Text>
      </LayoutContainer>

      <ScrollPanel className={styles.cardList}>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            className={styles.mainCard}
            onClick={handleClickTemplateCard(template.id)}
          >
            <TemplateCard.Tag usedCount={template.usedCount} />
            <TemplateCard.Title>{template.title}</TemplateCard.Title>
            <TemplateCard.UpdatedAt>{template.elapsedTime}</TemplateCard.UpdatedAt>
            <TemplateCard.Description>{template.description}</TemplateCard.Description>

            <TemplateCard.Profile
              profileUrl={template.creator.profileImage}
              nickname={template.creator.nickname}
              socialNickname={template.creator.snsName}
            />
          </TemplateCard>
        ))}
      </ScrollPanel>

      <div className={styles.temp}></div>
    </>
=======
      <TrendTemplate>
        <TrendTemplate.Title>인기 템플릿</TrendTemplate.Title>
        <TrendTemplate.TrendCardPanel templates={templates} />
      </TrendTemplate>
    </FlexContainer>
>>>>>>> d70460f14be4e652435dfcdb136914d383e6179a
  );
}

export default MainPage;
