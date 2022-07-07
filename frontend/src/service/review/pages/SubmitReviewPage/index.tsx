import cn from 'classnames';
import styles from './styles.module.scss';
import Logo from 'common/components/Logo';
import ProgressBar from 'common/components/ProgressBar';
import FieldSet from 'common/components/FieldSet';
import Text from 'common/components/Text';

function SubmitReviewPage() {
  return (
    <>
      <div className={cn(styles.container)}>
        <Logo />
        <Text className={cn(styles.title)} size={40} weight="bold">
          오늘의 기분은 어떤가요?
        </Text>
        <Text className={cn(styles.description)} size={16}>
          체크인 점수를 선택해주세요.
        </Text>
        <ProgressBar percent={6 / 1} />
        <Text className={cn(styles.progressText)} size={14}>
          총 6개의 질문 중 1개 답변됨
        </Text>
      </div>
      <div className={cn(styles.container)}>
        <FieldSet
          size="large"
          title="오늘의 기분은 어떤가요?"
          description="체크인 점수를 선택해 주세요."
        >
          <input type="textarea" />
        </FieldSet>
        <FieldSet
          size="large"
          title="내일의 기분은 어떤가요?"
          description="체크인 점수를 선택해 주세요."
        >
          <input type="textarea" />
        </FieldSet>
        <FieldSet
          size="large"
          title="모레의 기분은 어떤가요?"
          description="체크인 점수를 선택해 주세요."
        >
          <input type="textarea" />
        </FieldSet>
      </div>
    </>
  );
}

export default SubmitReviewPage;
