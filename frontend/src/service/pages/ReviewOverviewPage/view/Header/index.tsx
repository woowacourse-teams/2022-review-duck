import { Link } from 'react-router-dom';

import { faListCheck, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { Logo, Text, Button } from 'common/components';
import FlexContainer from 'common/components/FlexContainer';

import { PAGE_LIST } from 'constant';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.fixedContainer}>
        <nav className={cn(styles.container, styles.menuBar)}>{children}</nav>
      </div>
    </header>
  );
};

interface FormInformationProps {
  isLoading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const FormInformation = ({ isLoading, fallback, children }: FormInformationProps) => {
  return (
    <FlexContainer direction="row" gap="medium">
      <Link to={PAGE_LIST.HOME}>
        <Logo size="small" />
      </Link>

      <FlexContainer direction="column" justify="center" gap="small">
        {isLoading ? fallback : children}
      </FlexContainer>
    </FlexContainer>
  );
};

interface FormTextProps {
  children: React.ReactNode;
}

const Title = ({ children }: FormTextProps) => {
  return (
    <Text as="h4" className={styles.formTitle} size={24} weight="bold">
      {children}
    </Text>
  );
};

const Description = ({ children }: FormTextProps) => {
  return (
    <Text className={styles.formDescription} size={14}>
      {children}
    </Text>
  );
};

interface ChangeViewButtons {
  displayMode: string;
  reviewFormCode: string;
  onClickListView?: () => void;
  onClickSheetView?: () => void;
}

const ViewChangeButtons = ({
  reviewFormCode,
  displayMode = 'list',
  onClickListView,
  onClickSheetView,
}: ChangeViewButtons) => {
  const isListMode = displayMode === 'list';

  return (
    <FlexContainer
      className={styles.buttonContainer}
      direction="row"
      gap="small"
      justify="center"
      align="center"
    >
      <Link to={`${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`}>
        <Button theme={isListMode ? 'default' : 'outlined'} onClick={onClickListView}>
          <FontAwesomeIcon icon={faListCheck} />
          <span>목록형 보기</span>
        </Button>
      </Link>

      <Link to={`${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}/sheet`}>
        <Button theme={isListMode ? 'outlined' : 'default'} onClick={onClickSheetView}>
          <FontAwesomeIcon icon={faTableList} />
          <span>시트형 보기</span>
        </Button>
      </Link>
    </FlexContainer>
  );
};

export const Header = Object.assign(Container, {
  FormInformation,
  Title,
  Description,
  ViewChangeButtons,
});
