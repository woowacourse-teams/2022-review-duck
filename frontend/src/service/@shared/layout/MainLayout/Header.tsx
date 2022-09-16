import { Link } from 'react-router-dom';

import cn from 'classnames';
import { GITHUB_OAUTH_LOGIN_URL, MODAL_LIST, PAGE_LIST, TEMPLATE_TAB } from 'constant';

import useModal from 'common/hooks/useModal';
import useAuth from 'service/@shared/hooks/useAuth';

import { Button, Logo, Text, TextBox, PopupBox } from 'common/components';

import imageDefaultProfile from 'assets/images/profile.png';

import styles from './styles.module.scss';

import {
  faPenToSquare,
  faRightFromBracket,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header() {
  const { isLogin, getUserProfileQuery } = useAuth();
  const { showModal } = useModal();

  const { profileUrl: profileImage = imageDefaultProfile, socialId } =
    getUserProfileQuery.data || {};

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
          <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
        </div>

        <ul className={styles.menuList}>
          <Link to="/pending">
            <li className={styles.menuItem}>회고덕 소개</li>
          </Link>
          <Link to={PAGE_LIST.TEMPLATE_LIST}>
            <li className={styles.menuItem}>템플릿 탐색</li>
          </Link>

          <Link to="/pending">
            <li className={styles.menuItem}>타임라인</li>
          </Link>
        </ul>

        <div className={cn(styles.navItemContainer, styles.quickMenuContainer)}>
          <Button theme="outlined" size="small" onClick={onClickReviewStart}>
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
        </div>
      </nav>
    </header>
  );
}

export default Header;
