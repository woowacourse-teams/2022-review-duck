import { faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { Button, FlexContainer, TextBox } from 'common/components';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <FlexContainer className={cn(styles.editorContainer, styles.sticky)} direction="column">
      {children}
    </FlexContainer>
  );
}

interface TitleInputProps {
  title: string;
  onTitleChange: React.ChangeEventHandler;
}

function TitleInput({ title, onTitleChange }: TitleInputProps) {
  return (
    <TextBox
      theme="underline"
      size="large"
      placeholder="회고의 제목을 입력해주세요."
      value={title}
      onChange={onTitleChange}
    />
  );
}

interface CancelButtonProps {
  children: string;
  onCancel: React.MouseEventHandler;
}

function CancelButton({ children, onCancel }: CancelButtonProps) {
  return (
    <Button theme="outlined" onClick={onCancel}>
      <FontAwesomeIcon icon={faXmark} />
      <span>{children}</span>
    </Button>
  );
}

interface SubmitButtonProps {
  children: string;
  onSubmit: React.MouseEventHandler;
  disabled: boolean;
}

function SubmitButton({ children, onSubmit }: SubmitButtonProps) {
  return (
    <Button onClick={onSubmit}>
      <FontAwesomeIcon icon={faPenToSquare} />
      <span>{children}</span>
    </Button>
  );
}

export const Editor = Object.assign(Container, { TitleInput, CancelButton, SubmitButton });
