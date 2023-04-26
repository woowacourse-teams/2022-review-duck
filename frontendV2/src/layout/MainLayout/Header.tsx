import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare, faRightFromBracket, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UserAgentContext } from 'common/contexts/UserAgent';
import useModal from 'components/ModalProvider/useModal';
import useAuth from 'hooks/useAuth';
import useNavigateHandler from 'hooks/useNavigateHandler';
import { validateSearch } from 'validator';

import useSnackbar from 'common/hooks/useSnackbar';

import { Button, Logo, Text, TextBox, FlexContainer, SelectPopup } from 'common/components';

import imageDefaultProfile from 'assets/images/profile.png';
import { GITHUB_OAUTH_LOGIN_URL, MODAL_LIST, PAGE_LIST, RULE } from 'constant';
import { getErrorMessage } from 'utils';

import styles from './styles.module.scss';

function Header() {
  const { isPC } = useContext(UserAgentContext);
  const { isLogin, getUserProfileQuery } = useAuth();
  const { navigate, handleLinkPage } = useNavigateHandler();

  const snackbar = useSnackbar();
  const modal = useModal();

  const { profileUrl: profileImage = imageDefaultProfile, socialId } = getUserProfileQuery.data || {};

  const handleReviewModalOpen = () => {
    modal.show({ key: MODAL_LIST.REVIEW_START });
  };

  const handleSubmitSearchTemplate: React.FormEventHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const searchKeyword = formData.get('search')?.toString() || '';

    try {
      validateSearch(searchKeyword);
      navigate(`${PAGE_LIST.TEMPLATE_LIST}?search=${searchKeyword}`);
    } catch (error) {
      snackbar.show({
        theme: 'warning',
        title: '검색어를 입력해주세요.',
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <header className={styles.layoutComponentHeader}>
      <nav className={styles.navbar}>
        <FlexContainer direction="row" align="center">
          <Link to={PAGE_LIST.HOME}>
            <Logo className={styles.logo} theme={isPC ? 'border' : 'filled'} weight="bold" size="small" />
          </Link>
        </FlexContainer>

        <FlexContainer as="form" direction="row" align="center" onSubmit={handleSubmitSearchTemplate}>
          <TextBox
            name="search"
            placeholder="회고를 위한 템플릿 검색"
            minLength={RULE.SEARCH_MIN_LENGTH}
            maxLength={RULE.SEARCH_MAX_LENGTH}
          />

          <button type="submit" className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </FlexContainer>

        <ul className={styles.menuList}>
          <a
            href="https://sites.google.com/woowahan.com/woowacourse-demo-4th/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%ED%9A%8C%EA%B3%A0%EB%8D%95?authuser=0"
            target="_blank"
            rel=" noopener noreferrer"
          >
            <li className={styles.item}>회고덕 소개</li>
          </a>

          <Link to={PAGE_LIST.TEMPLATE_LIST}>
            <li className={styles.item}>템플릿 탐색</li>
          </Link>

          <Link to={PAGE_LIST.TIMELINE}>
            <li className={styles.item}>타임라인</li>
          </Link>
        </ul>

        <FlexContainer className={styles.quickMenuContainer} direction="row" align="center">
          <Button
            className={styles.quickReviewStartButton}
            theme="outlined"
            size="small"
            onClick={handleReviewModalOpen}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>회고 시작하기</span>
          </Button>

          {isLogin ? (
            <SelectPopup
              justify="right"
              fallback={<div className={styles.profile} style={{ backgroundImage: `url(${profileImage})` }} />}
            >
              <FlexContainer
                className={styles.popupMenu}
                direction="row"
                align="center"
                justify="space-between"
                onClick={handleLinkPage(`${PAGE_LIST.USER_PROFILE}/${socialId}`)}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>마이 페이지</span>
              </FlexContainer>

              <FlexContainer
                className={styles.popupMenu}
                direction="row"
                align="center"
                justify="space-between"
                onClick={handleLinkPage(`${PAGE_LIST.LOGOUT}`)}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>로그아웃</span>
              </FlexContainer>
            </SelectPopup>
          ) : (
            <a href={GITHUB_OAUTH_LOGIN_URL}>
              <Text className={styles.loginText} weight="lighter">
                LOGIN
              </Text>
            </a>
          )}
        </FlexContainer>
      </nav>
    </header>
  );
}

export default Header;
