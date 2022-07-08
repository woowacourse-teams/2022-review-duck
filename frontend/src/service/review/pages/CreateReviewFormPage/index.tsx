import cn from 'classnames';
import styles from './styles.module.scss';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';
import QuestionCard from 'service/review/components/QuestionCard';
import Logo from 'common/components/Logo';
import TextBox from 'common/components/TextBox';
import QuestionEditor from 'service/review/components/QuestionEditor';
import { ChangeEvent, useState } from 'react';

interface Question {
  questionValue: string;
}

function CreateReviewFormPage() {
  const [reviewTitle, setReviewTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{ questionValue: '' }]);

  const handleUpdateQuestion = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const copiedQuestions = [...questions];
    const updatedQuestion = { ...questions[index], questionValue: event.target.value };

    copiedQuestions.splice(index, 1, updatedQuestion);
    setQuestions(copiedQuestions);
  };

  const handleAddQuestion = () => {
    const copiedQuestions = [...questions];

    copiedQuestions.push({ questionValue: '' });
    setQuestions(copiedQuestions);
  };

  const handleDeleteQuestion =
    (index: number) =>
    ({ currentTarget }: any) => {
      if (questions.length <= 1) {
        return;
      }

      const copiedQuestions = [...questions];

      copiedQuestions.splice(index, 1);
      setQuestions(copiedQuestions);

      const $beforeTextBox = currentTarget.form.querySelectorAll('input.question')[index - 1];

      $beforeTextBox && $beforeTextBox.focus();
    };

  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <Logo />

        <div className={cn(styles.previewContainer, 'flex-container column')}>
          {questions.map(
            ({ questionValue }, index) =>
              questionValue && (
                <QuestionCard
                  key={index}
                  numbering={index + 1}
                  type="text"
                  title={questionValue}
                  description="질문 설명이 이곳에 표기됩니다."
                />
              ),
          )}
        </div>
      </div>

      <div>
        <form className={cn(styles.container, styles.sticky, 'flex-container column')}>
          <TextBox theme="underline" size="large" placeholder="회고의 제목을 입력해주세요." />

          <div className={cn(styles.itemContainer, 'flex-container column')}>
            {questions.map(({ questionValue }, index) => (
              <QuestionEditor
                key={index}
                numbering={index + 1}
                value={questionValue}
                onChange={handleUpdateQuestion(index)}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion(index)}
              />
            ))}
          </div>

          <div className={cn('button-container horizontal')}>
            <Button theme="outlined">
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>

            <Button type="button">
              <Icon code="drive_file_rename_outline" />
              <span>생성하기</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateReviewFormPage;
