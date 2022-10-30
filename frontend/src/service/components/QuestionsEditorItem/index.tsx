import { faBackspace, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FlexContainer, Textarea } from 'common/components';
import Button from 'common/components/Button';
import Text from 'common/components/Text';
import TextBox from 'common/components/TextBox';

import styles from './styles.module.scss';

type UpdateQuestionEvent = React.MouseEvent | React.KeyboardEvent<HTMLInputElement>;

interface QuestionsEditorItemProps {
  numbering: number;
  description: string;
  children?: string;
  onChangeQuestion?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddQuestion?: (event: UpdateQuestionEvent) => void;
  onDeleteQuestion?: (event: UpdateQuestionEvent) => void;
}

function QuestionsEditorItem({
  numbering,
  description,
  children,
  onChangeQuestion,
  onChangeDescription,
  onAddQuestion,
  onDeleteQuestion,
}: QuestionsEditorItemProps) {
  const handleChangeQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeQuestion && onChangeQuestion(event);
  };

  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeDescription && onChangeDescription(event);
  };

  const handleKeyUpTextBox = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    onAddQuestion && onAddQuestion(event);
  };

  const handleKeyDownTextBox = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.target.value || event.key !== 'Backspace') return;

    event.preventDefault();
    onDeleteQuestion && !event.target.value && onDeleteQuestion(event);
  };

  return (
    <FlexContainer className={styles.container} gap="medium">
      <div className={styles.gridContainer}>
        <Text as="span" className={styles.numbering} size={18} weight="bold">
          {`Q${numbering}`}
        </Text>

        <TextBox
          className={styles.question}
          placeholder="질문 타이틀을 입력해주세요."
          value={children}
          onChange={handleChangeQuestion}
          onKeyDown={handleKeyDownTextBox}
          onKeyPress={handleKeyUpTextBox}
        />

        <FlexContainer direction="row" justify="right" gap="small">
          <Button
            className={styles.button}
            theme="circle"
            size="medium"
            aria-label="질문 추가하기"
            onClick={onAddQuestion}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>

          <Button
            className={styles.button}
            theme="circle"
            size="medium"
            aria-label="질문 제거하기"
            onClick={onDeleteQuestion}
          >
            <FontAwesomeIcon icon={faBackspace} />
          </Button>
        </FlexContainer>
      </div>

      <Textarea
        className={styles.textarea}
        placeholder="질문에 대한 설명은 최대 200자까지 입력할 수 있습니다."
        onChange={handleChangeDescription}
        value={description}
      />
    </FlexContainer>
  );
}

export default QuestionsEditorItem;
