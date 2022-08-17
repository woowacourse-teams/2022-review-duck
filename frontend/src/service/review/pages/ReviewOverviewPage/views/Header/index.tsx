import { Link } from 'react-router-dom';

import cn from 'classnames';

import { Logo, Text, Button, Icon } from 'common/components';

import FlexContainer from 'common/components/FlexContainer';

import styles from './styles.module.scss';

import { PAGE_LIST } from 'service/@shared/constants';
import pageStyles from 'service/review/pages/ReviewOverviewPage/styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <header className={styles.header}>
      <nav className={cn(pageStyles.container, styles.menuBar)}>{children}</nav>
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
  children?: string;
}

const Title = ({ children }: FormTextProps) => {
  return (
    <Text className={styles.formTitle} size={24} element="h4" weight="bold">
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
  viewMode: boolean;
  onClickListView?: () => void;
  onClickSheetView?: () => void;
}

const ViewChangeButtons = ({ viewMode, onClickListView, onClickSheetView }: ChangeViewButtons) => {
  return (
    <FlexContainer direction="row" gap="small" justify="center" align="center">
      <Button theme={viewMode ? 'default' : 'outlined'} onClick={onClickListView}>
        <Icon code="list" />
        <span>목록형 보기</span>
      </Button>

      <Button theme={viewMode ? 'default' : 'outlined'} onClick={onClickSheetView}>
        <Icon code="table_view" />
        <span>시트형 보기</span>
      </Button>
    </FlexContainer>
  );
};

export const Header = Object.assign(Container, {
  FormInformation,
  Title,
  Description,
  ViewChangeButtons,
});
