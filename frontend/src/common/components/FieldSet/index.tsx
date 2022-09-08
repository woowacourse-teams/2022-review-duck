import cn from 'classnames';

import Icon from 'common/components/Icon';
import Text from 'common/components/Text';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

function FieldSetContainer({ className, children }: ContainerProps) {
  return (
    <FlexContainer className={className} direction="column" gap="medium">
      {children}
    </FlexContainer>
  );
}

interface TitleProps {
  title: string;
  size?: 'medium' | 'large';
}

function Title({ title, size = 'medium' }: TitleProps) {
  return <Text className={cn(styles.title, styles[`size-${size}`])}>{title}</Text>;
}

interface DescriptionProps {
  description: string;
}

function Description({ description }: DescriptionProps) {
  return (
    <FlexContainer className={cn(styles.description)} align="center" direction="row">
      <Icon code="chevron_right" />
      <span>{description}</span>
    </FlexContainer>
  );
}

const FieldSet = Object.assign(FieldSetContainer, {
  Title,
  Description,
});

export default FieldSet;
