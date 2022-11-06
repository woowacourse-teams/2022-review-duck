import {
  faArrowRightFromBracket,
  faCircleQuestion,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FieldSet, Textarea, Button, ToolTip, CheckBox, TextBox } from 'common/components';
import { CheckboxProps } from 'common/components/CheckBox';

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

interface TitleInputProps {
  title: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const TitleInput = ({ title, placeholder, onChange }: TitleInputProps) => {
  return (
    <TextBox
      onChange={onChange}
      value={title}
      placeholder={placeholder}
      theme="underline"
      size="large"
    />
  );
};

interface AnswerFieldProps {
  question: string;
  description?: string;
  answer?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus: React.FocusEventHandler<HTMLTextAreaElement>;
}

const AnswerField = ({ question, description, answer, onChange, onFocus }: AnswerFieldProps) => {
  return (
    <FieldSet>
      <FieldSet.Title size="large">{question}</FieldSet.Title>
      <Textarea size="large" value={answer} onChange={onChange} onFocus={onFocus} />
      {description && <FieldSet.Description>{description}</FieldSet.Description>}
    </FieldSet>
  );
};

type PrivateCheckBoxProps = Omit<CheckboxProps, 'children'>;

const PrivateCheckBox = ({ ...rest }: PrivateCheckBoxProps) => {
  return (
    <ToolTip text="회고를 비공개로 설정할 시 프로필 페이지와 타임라인에서 보이지 않습니다">
      <CheckBox className={styles.privateCheckBox} {...rest}>
        이 회고를 다른 사용자에게 공개하지 않기
        <FontAwesomeIcon className={styles.tipIcon} icon={faCircleQuestion} />
      </CheckBox>
    </ToolTip>
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
      <Button type="button" theme="outlined" onClick={onCancel}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span>취소하기</span>
      </Button>

      <Button type="button" disabled={submitDisabled} onClick={onSubmit}>
        <FontAwesomeIcon icon={faPenToSquare} />
        <span>제출하기</span>
      </Button>
    </div>
  );
};

export const Editor = Object.assign(Container, {
  TitleInput,
  AnswerField,
  PrivateCheckBox,
  ConfirmButtons,
});
