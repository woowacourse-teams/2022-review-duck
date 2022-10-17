import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  faPenToSquare,
  faRightFromBracket,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GITHUB_OAUTH_LOGIN_URL, MODAL_LIST, PAGE_LIST } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';
import useAuth from 'service/@shared/hooks/useAuth';
import useNavigateHandler from 'service/@shared/hooks/useNavigateHandler';

import { Button, Logo, Text, TextBox, PopupBox, FlexContainer } from 'common/components';

import useModal from 'service/@shared/components/ModalProvider/useModal';

import imageDefaultProfile from 'assets/images/profile.png';

import styles from './styles.module.scss';

import { UserAgentContext } from 'common/contexts/UserAgent';

function Header() {
  const { isPC, isMobile } = useContext(UserAgentContext);
  const { isLogin, getUserProfileQuery } = useAuth();
  const { navigate, handleLinkPage } = useNavigateHandler();

  const snackbar = useSnackbar();
  const modal = useModal();

  const { profileUrl: profileImage = imageDefaultProfile, socialId } =
    getUserProfileQuery.data || {};

  const handleReviewModalOpen = () => {
    modal.show({ key: MODAL_LIST.REVIEW_START });
  };

  const handleSubmitSearchTemplate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchKeyword = formData.get('search')?.toString() || '';

    if (!searchKeyword) {
      snackbar.show({
        theme: 'warning',
        title: '검색어를 입력해주세요.',
        description: '템플릿 검색은 최소 1자 이상 입력하여야 합니다.',
      });
      return;
    }

    navigate(`${PAGE_LIST.TEMPLATE_LIST}?search=${searchKeyword}`);
  };

  return (
    <header className={styles.layoutComponentHeader}>
      <nav className={styles.navbar}>
        <FlexContainer direction="row" align="center">
          <Link to={PAGE_LIST.HOME}>
            <Logo
              className={styles.logo}
              theme={isPC ? 'border' : 'filled'}
              weight="bold"
              size="small"
            />
          </Link>
        </FlexContainer>

        <FlexContainer
          as="form"
          direction="row"
          align="center"
          onSubmit={handleSubmitSearchTemplate}
        >
          <TextBox name="search" placeholder="빠른 회고를 위한 템플릿 검색" />

          <button type="submit" className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </FlexContainer>

        <ul className={styles.menuList}>
          <Link to="/pending">
            <li className={styles.item}>회고덕 소개</li>
          </Link>
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
            <PopupBox
              className={styles.userMenu}
              fallback={
                <div
                  className={styles.profile}
                  style={{ backgroundImage: `url(${profileImage})` }}
                  onClick={
                    isMobile ? handleLinkPage(`${PAGE_LIST.USER_PROFILE}/${socialId}`) : undefined
                  }
                />
              }
            >
              <Link className={styles.item} to={`${PAGE_LIST.USER_PROFILE}/${socialId}`}>
                <FontAwesomeIcon icon={faUser} /> <span>마이 페이지</span>
              </Link>

              <Link className={styles.item} to={PAGE_LIST.LOGOUT}>
                <FontAwesomeIcon icon={faRightFromBracket} /> <span>로그아웃</span>
              </Link>
            </PopupBox>
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
