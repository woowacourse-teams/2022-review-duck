import { Text, FieldSet, Textarea, Button, Icon } from 'common/components';

import styles from './styles.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Container = ({ onSubmit, children, ...rest }: ContainerProps) => {
  return (
    <form className={styles.container} onSubmit={onSubmit} {...rest}>
      {children}
    </form>
  );
};

interface TitleProps {
  children: string;
}

const Title = ({ children }: TitleProps) => {
  return (
    <Text className={styles.reviewFormTitle} size={24} weight="bold">
      {children}
    </Text>
  );
};

interface AnswerFieldProps {
  question: string;
  description?: string;
  answer?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const AnswerField = ({ question, description, answer, onChange }: AnswerFieldProps) => {
  return (
    <FieldSet size="large" title={question} description={description}>
      <Textarea size="large" value={answer} onChange={onChange} />
    </FieldSet>
  );
};

interface ConfirmButtonsProps {
  submitDisabled: boolean;
  onSubmit: React.FormEventHandler;
  onCancel: () => void;
}

const ConfirmButtons = ({ submitDisabled, onSubmit, onCancel }: ConfirmButtonsProps) => {
  return (
    <div className={styles.confirmButtons}>
      <Button theme="outlined" onClick={onCancel}>
        <Icon code="cancel" />
        <span>취소하기</span>
      </Button>

      <Button type="button" disabled={submitDisabled} onClick={onSubmit}>
        <Icon code="send" />
        <span>제출하기</span>
      </Button>
    </div>
  );
};

export const Editor = Object.assign(Container, {
  Title,
  AnswerField,
  ConfirmButtons,
});
