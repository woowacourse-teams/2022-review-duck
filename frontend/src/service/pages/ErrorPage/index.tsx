import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { faCircleQuestion, faFaceSurprise } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleChevronLeft,
  faHome,
  faUnlockKeyhole,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, FlexContainer, Text } from 'common/components';
import { ErrorBoundaryFallbackProps } from 'common/components/ErrorBoundary';

import { GITHUB_OAUTH_LOGIN_URL, PAGE_LIST } from 'constant';

import styles from './styles.module.scss';

function ErrorPage({ status, title, description, onResetError }: ErrorBoundaryFallbackProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    return () => onResetError && onResetError();
  }, [pathname, onResetError]);

  const handlePreviousPage = () => {
    navigate(-1);
  };

  const errorIcon = () => {
    switch (status) {
      case 403:
        return faUnlockKeyhole;

      case 404:
        return faCircleQuestion;

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
        <Text as="h1" className={styles.title} size={32} weight="bold">
          {title}
        </Text>
      </FlexContainer>

      <FlexContainer className={styles.buttonContainer} direction="row" gap="medium">
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
