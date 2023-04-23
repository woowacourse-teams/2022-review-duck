import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { faFeather } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import useModal from 'components/ModalProvider/useModal';
import useNavigateHandler from 'hooks/useNavigateHandler';

import { Button, FlexContainer } from 'common/components';

import styles from './styles.module.scss';

interface MenuContainerProps {
  children: React.ReactNode;
}

function Container({ children }: MenuContainerProps) {
  const modal = useModal();

  const handleReviewStart = () => {
    modal.show({ key: 'ModalReviewStart' });
  };

  return (
    <nav className={styles.layoutComponentMobileMenubar}>
      {children}

      <Button
        type="button"
        className={styles.floatingButton}
        theme="circle"
        size="large"
        onClick={handleReviewStart}
      >
        <FontAwesomeIcon icon={faFeather} />
      </Button>
    </nav>
  );
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
