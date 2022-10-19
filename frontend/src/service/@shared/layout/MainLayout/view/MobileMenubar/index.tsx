import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import useNavigateHandler from 'service/@shared/hooks/useNavigateHandler';

import { FlexContainer, Text } from 'common/components';

import styles from './styles.module.scss';

interface MenuContainerProps {
  children: React.ReactNode;
}

function Container({ children }: MenuContainerProps) {
  return <nav className={styles.layoutComponentMobileMenubar}>{children}</nav>;
}

interface MenuItemProps {
  route: string;
  children: JSX.Element;
}

function Item({ route, children }: MenuItemProps) {
  const { pathname } = useLocation();
  const { handleLinkPage } = useNavigateHandler();

  const isFocused = useMemo(() => {
    const pathGroup = pathname.split('/')[1];
    const itemGroup = route.split('/')[1].split('?')[0];

    return pathGroup === itemGroup;
  }, [pathname]);

  return (
    <FlexContainer
      className={cn(styles.menu, { [styles.focused]: isFocused })}
      justify="center"
      align="center"
      onClick={handleLinkPage(route)}
    >
      {children}
    </FlexContainer>
  );
}

const MobileMenu = Object.assign(Container, { Item });

export default MobileMenu;
