import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

import cn from 'classnames';

import Button from 'common/components/Button';
import Icon from 'common/components/Icon';
import Text from 'common/components/Text';
import TextBox from 'common/components/TextBox';

import styles from './styles.module.scss';

interface Props {
  numbering: number;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddQuestion?: (event: MouseEvent | KeyboardEvent) => void;
  onDeleteQuestion?: (event: MouseEvent | KeyboardEvent) => void;
}

function QuestionEditor({ numbering, value, onChange, onAddQuestion, onDeleteQuestion }: Props) {
  const handleKeyUpTextBox = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    switch (event.key) {
      case 'Enter':
        onAddQuestion && onAddQuestion(event);
        break;

      case 'Backspace':
        onDeleteQuestion && !value && onDeleteQuestion(event);
        break;
    }
  };

  return (
    <div className={cn(styles.container, 'flex-container row')}>
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
