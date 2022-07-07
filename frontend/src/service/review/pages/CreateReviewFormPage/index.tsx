import cn from 'classnames';
import styles from './styles.module.scss';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';
import QuestionCard from 'service/review/components/QuestionCard';
import FieldSet from 'common/components/FieldSet';

function CreateReviewFormPage() {
  // TODO: 로고 넣기, 우측 폼 작성하기
  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <QuestionCard
          numbering={1}
          type="text"
          title="이곳에 질문이 표시됩니다."
          description="이곳에 질문 설명이 표기됩니다."
        />

        <QuestionCard
          numbering={2}
          type="text"
          title="이곳에 질문이 표시됩니다."
          description="이곳에 질문 설명이 표기됩니다."
        />

        <QuestionCard
          numbering={3}
          type="text"
          title="이곳에 질문이 표시됩니다."
          description="이곳에 질문 설명이 표기됩니다."
        />
      </div>

      <div className={cn(styles.container, 'flex-container column')}>
        <h1 className={cn(styles.title)}>회고 생성하기</h1>
        <p className={cn(styles.subtitle)}>설명이 입력될 위치입니다.</p>

        <FieldSet title="TEST">
          <div>
            <input type="text"></input>
            <Button>+</Button>
          </div>
        </FieldSet>

        <div className={cn('button-container horizontal')}>
          <Button size="medium" outlined>
            <Icon code="cancel"></Icon>
            취소하기
          </Button>
          <Button type="submit" size="medium">
            <Icon code="drive_file_rename_outline"></Icon>
            생성하기
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateReviewFormPage;
