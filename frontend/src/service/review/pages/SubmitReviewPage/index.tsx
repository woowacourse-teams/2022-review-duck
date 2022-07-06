import cn from 'classnames';
import styles from './styles.module.scss';
import Logo from 'common/components/Logo';
import ProgressBar from 'common/components/ProgressBar';
import FieldSet from 'common/components/FieldSet';

function SubmitReviewPage() {
  return (
    <>
      <div className={cn(styles.container)}>
        <Logo />
        <h1 className={cn(styles.title)}>오늘의 기분은 어떤가요?</h1>
        <span className={cn(styles.description)}>체크인 점수를 선택해주세요.</span>
        <ProgressBar percent={6 / 1} />
        <span className={cn(styles.progress)}>총 6개의 질문 중 1개 답변됨</span>
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
