import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { GITHUB_OAUTH_LOGIN_URL, PAGE_LIST } from 'constant';

import { Button, FlexContainer, Text } from 'common/components';

import styles from './styles.module.scss';

import {
  faCircleChevronLeft,
  faFaceSurprise,
  faHome,
  faTriangleExclamation,
  faUser,
  faUserLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ErrorPageProps {
  status?: string | number;
  title: string;
  description: string;
  onResetError?: () => void;
}

function ErrorPage({ status, title, description, onResetError }: ErrorPageProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    return () => onResetError && onResetError();
  }, [pathname, onResetError]);

  const handlePreviousPage = () => {
    onResetError && onResetError();
    navigate(-1);
  };

  const errorIcon = () => {
    switch (status) {
      case 403:
        return faUserLock;

      case 404:
        return faTriangleExclamation;

      default:
        return faFaceSurprise;
    }
  };

  return (
    <FlexContainer className={styles.container} align="center">
      <FlexContainer className={styles.blurCardContainer} justify="center">
        <FlexContainer className={styles.errorIcon} justify="center" align="center">
          <FontAwesomeIcon icon={errorIcon()} />
        </FlexContainer>
        <div className={styles.errorNumber}>{status}</div>

        <Text className={styles.description} size={48} weight="bold">
          {description}
        </Text>
      </FlexContainer>

      <FlexContainer className={styles.textContainer} gap="medium">
        <Text className={styles.title} size={32} element="h1">
          {title}
        </Text>
      </FlexContainer>

      <FlexContainer direction="row" gap="medium">
        {status === 403 ? (
          <a href={GITHUB_OAUTH_LOGIN_URL}>
            <Button>
              <FontAwesomeIcon icon={faUser} />
              <span>회고덕 로그인</span>
            </Button>
          </a>
        ) : (
          <Link to={PAGE_LIST.HOME} onClick={onResetError}>
            <Button>
              <FontAwesomeIcon icon={faHome} />
              <span>회고덕 홈 화면</span>
            </Button>
          </Link>
        )}

        <Button theme="outlined" onClick={handlePreviousPage}>
          <FontAwesomeIcon icon={faCircleChevronLeft} />
          <span>이전 화면</span>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
}

export default ErrorPage;
