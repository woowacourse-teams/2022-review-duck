import { Link } from 'react-router-dom';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { FILTER, PAGE_LIST } from 'constant';
import { TimelineFilterType } from 'types';

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

function List({ children }: ListProps) {
  return (
    <FlexContainer as="ul" className={styles.list}>
      {children}
    </FlexContainer>
  );
}

interface MenuProps {
  isCurrentTab: boolean;
  filter: TimelineFilterType;
  icon: IconDefinition;
  children: string;
}

function Menu({ isCurrentTab, filter, icon, children }: MenuProps) {
  return (
    <Link to={`${PAGE_LIST.TIMELINE}?${FILTER.SORT}=${filter}`}>
      <li className={cn(styles.menu, { [styles.focus]: isCurrentTab })}>
        <FontAwesomeIcon icon={icon} /> {children}
      </li>
    </Link>
  );
}

const SideMenu = Object.assign(Container, {
  Title,
  List,
  Menu,
});

export default SideMenu;
