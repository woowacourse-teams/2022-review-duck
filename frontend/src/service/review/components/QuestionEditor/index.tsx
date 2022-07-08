import cn from 'classnames';
import TextBox from 'common/components/TextBox';

import styles from './styles.module.scss';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';
import Text from 'common/components/Text';
import { AnimationEvent, ChangeEvent, KeyboardEvent } from 'react';

interface Props {
  numbering: number;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddQuestion?: () => void;
  onDeleteQuestion?: (event: any) => void;
}

function QuestionEditor({ numbering, value, onChange, onAddQuestion, onDeleteQuestion }: Props) {
  const handleKeyUpTextBox = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    switch (event.key) {
      case 'Enter':
        onAddQuestion && onAddQuestion();
        break;

      case 'Backspace':
        onDeleteQuestion && !value && onDeleteQuestion(event);
        break;
    }
  };

  const onAnimationEnd = (event: AnimationEvent) => {
    event.currentTarget.querySelector('input')?.focus();
  };

  return (
    <div className={cn(styles.container, 'flex-container row')} onAnimationStart={onAnimationEnd}>
      <Text className={styles.numbering} size={18} weight="bold">
        {`Q${numbering}`}
      </Text>

      <TextBox
        className={cn('question', styles.question)}
        placeholder="질문 타이틀을 입력해주세요."
        value={value}
        onChange={onChange}
        onKeyUp={handleKeyUpTextBox}
      />

      <div className={cn(styles.buttonContainer, 'flex-container row')}>
        <Button className={styles.button} theme="circle" size="medium" onClick={onAddQuestion}>
          <Icon code="add" />
        </Button>

        <Button className={styles.button} theme="circle" size="medium" onClick={onDeleteQuestion}>
          <Icon code="backspace" />
        </Button>
      </div>
    </div>
  );
}

export default QuestionEditor;
