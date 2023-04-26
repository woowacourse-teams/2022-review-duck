import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { FlexContainer, Text } from 'common/components';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <FlexContainer className={styles.componentSideMenu} gap="large">
      {children}
    </FlexContainer>
  );
}

interface TitleProps {
  children: string;
}

function Title({ children }: TitleProps) {
  return (
    <Text as="div" className={styles.title} size={24}>
      {children}
    </Text>
  );
}

interface ListProps {
  children: React.ReactNode;
}

function Wrapper({ children }: ListProps) {
  return (
    <FlexContainer as="ul" className={styles.list}>
      {children}
    </FlexContainer>
  );
}

interface MenuProps {
  selected?: boolean;
  icon: IconDefinition;
  children: string;
}

function Item({ selected, icon, children }: MenuProps) {
  return (
    <li className={cn(styles.menu, { [styles.focus]: selected })}>
      <FontAwesomeIcon icon={icon} /> {children}
    </li>
  );
}

const SideMenu = Object.assign(Container, {
  Title,
  Wrapper,
  Item,
});

export default SideMenu;
