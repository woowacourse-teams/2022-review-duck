import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, FlexContainer, Icon, Text } from 'common/components';

import styles from './styles.module.scss';

import { GITHUB_OAUTH_LOGIN_URL, PAGE_LIST } from 'service/@shared/constants';

interface Props {
  status?: string | number;
  title: string;
  description: string;
  onResetError?: () => void;
}

function ErrorPage({ status, title, description, onResetError }: Props) {
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
        return 'person_outline';

      case 404:
        return 'sd_card_alert';

      default:
        return 'error_outline';
    }
  };

  return (
    <FlexContainer className={styles.container} align="center">
      <FlexContainer className={styles.blurCardContainer} justify="center">
        <FlexContainer className={styles.errorIcon} justify="center" align="center">
          <Icon code={errorIcon()} />
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
              <Icon code="person" />
              <span>{'회고덕 로그인'}</span>
            </Button>
          </a>
        ) : (
          <Link to={PAGE_LIST.HOME} onClick={onResetError}>
            <Button>
              <Icon code="home" />
              <span>{'회고덕 홈 화면'}</span>
            </Button>
          </Link>
        )}

        <Button theme="outlined" onClick={handlePreviousPage}>
          <Icon code="keyboard_return" />
          <span>이전 화면</span>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
}

export default ErrorPage;
