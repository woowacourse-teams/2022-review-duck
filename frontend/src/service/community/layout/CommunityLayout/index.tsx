import { Outlet } from 'react-router-dom';

import cn from 'classnames';

import { Button, Icon, Logo, Text, TextBox } from 'common/components';

import styles from './styles.module.scss';

function CommunityLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={cn(styles.navbar, styles.container)}>
          <div className={styles.navItemContainer}>
            <Logo theme="border" weight="bold" size="small" />
          </div>

          <div className={styles.navItemContainer}>
            <TextBox placeholder="검색어를 입력해주세요." />
            <Icon className={styles.searchIcon} code="search" />
          </div>

          <ul className={styles.menuList}>
            <li>회고덕 소개</li>
            <li>템플릿 탐색</li>
            <li>타임라인</li>
          </ul>

          <div className={cn(styles.navItemContainer, styles.quickMenuContainer)}>
            <Button theme="outlined" size="small">
              <Icon code="flag" type="outlined" />
              <span>회고 시작하기</span>
            </Button>

            <a
              href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_KEY}`}
            >
              <Text className={styles.loginText} weight="lighter">
                LOGIN
              </Text>
            </a>
            {/*  <div className={styles.profile}></div> */}
          </div>
        </nav>
      </header>

      <main className={cn(styles.container, styles.main)}>
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
}

export default CommunityLayout;
