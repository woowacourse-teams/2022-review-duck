import { Link } from 'react-router-dom';

import cn from 'classnames';

import useModal from 'common/hooks/useModal';
import useAuth from 'service/@shared/hooks/useAuth';

import { Button, Icon, Logo, Text, TextBox, PopupBox } from 'common/components';

import imageDefaultProfile from 'assets/images/profile.png';

import styles from './styles.module.scss';

import { GITHUB_OAUTH_LOGIN_URL, MODAL_LIST, PAGE_LIST } from 'service/@shared/constants';

function Header() {
  const { isLogin, getUserProfileQuery } = useAuth();
  const { showModal } = useModal();

  const { profileUrl: profileImage = imageDefaultProfile } = getUserProfileQuery.data || {};

  const onClickReviewStart = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };

  return (
    <header className={styles.header}>
      <nav className={cn(styles.navbar, styles.container)}>
        <div className={styles.navItemContainer}>
          <Link to={PAGE_LIST.HOME}>
            <Logo theme="border" weight="bold" size="small" />
          </Link>
        </div>

        <div className={styles.navItemContainer}>
          <TextBox placeholder="검색어를 입력해주세요." />
          <Icon className={styles.searchIcon} code="search" />
        </div>

        <ul className={styles.menuList}>
          <li className={styles.menuItem}>회고덕 소개</li>
          <Link to={PAGE_LIST.TEMPLATE_STORE}>
            <li className={styles.menuItem}>템플릿 탐색</li>
          </Link>
          <li className={styles.menuItem}>타임라인</li>
        </ul>

        <div className={cn(styles.navItemContainer, styles.quickMenuContainer)}>
          <Button theme="outlined" size="small" onClick={onClickReviewStart}>
            <Icon code="flag" type="outlined" />
            <span>회고 시작하기</span>
          </Button>

          {isLogin ? (
            <PopupBox
              className={styles.userMenu}
              fallback={
                <div
                  className={styles.profile}
                  style={{ backgroundImage: `url(${profileImage})` }}
                />
              }
            >
              <Link className={styles.item} to={PAGE_LIST.MY_PAGE}>
                <Icon code="person" /> <span>마이 페이지</span>
              </Link>

              <Link className={styles.item} to={PAGE_LIST.LOGOUT}>
                <Icon code="logout" /> <span>로그아웃</span>
              </Link>
            </PopupBox>
          ) : (
            <a href={GITHUB_OAUTH_LOGIN_URL}>
              <Text className={styles.loginText} weight="lighter">
                LOGIN
              </Text>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
