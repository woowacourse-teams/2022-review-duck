import cn from 'classnames';

import { Icon, Text } from 'common/components';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';

interface FieldSetContainerProps {
  className?: string;
  children: React.ReactNode;
}

function FieldSetContainer({ className, children }: FieldSetContainerProps) {
  return (
    <FlexContainer className={className} direction="column" gap="medium">
      {children}
    </FlexContainer>
  );
}

interface FieldSetTitleProps {
  children: React.ReactNode;
  size?: 'medium' | 'large';
}

function Title({ children, size = 'medium' }: FieldSetTitleProps) {
  return <Text className={cn(styles.title, styles[`size-${size}`])}>{children}</Text>;
}

interface FieldSetDescriptionProps {
  children: React.ReactNode;
}

function Description({ children }: FieldSetDescriptionProps) {
  return (
    <FlexContainer className={styles.description} align="center" direction="row">
      <Icon code="chevron_right" />
      {children}
    </FlexContainer>
  );
}

const FieldSet = Object.assign(FieldSetContainer, {
  Title,
  Description,
});

export default FieldSet;
