import { FlexContainer, Text } from 'common/components';

import styles from './styles.module.scss';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function List({ children }: ListProps) {
  return (
    <FlexContainer as="ul" className={styles.list}>
      {children}
    </FlexContainer>
  );
}

interface MenuProps {
  icon: IconDefinition;
  children: string;
}

function Menu({ icon, children }: MenuProps) {
  return (
    <li className={styles.menu}>
      <FontAwesomeIcon icon={icon} /> {children}
    </li>
  );
}

const SideMenu = Object.assign(Container, {
  Title,
  List,
  Menu,
});

export default SideMenu;
