import PageSuspense from 'common/components/PageSuspense';

import Main from './container/Main';
import Timeline from './container/Timeline';
import LayoutContainer from 'components/LayoutContainer';
import SideMenu from 'components/SideMenu';
import { Link } from 'react-router-dom';
import { ReviewTimelineContainer } from 'containers';
import { PAGE_LIST } from 'constant';
import { faArrowTrendUp, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserAgentContext } from 'common/contexts/UserAgent';
import styles from './styles.module.scss';

function MainPage() {
  const { isMobile } = useContext(UserAgentContext);

  /* network waterfall 문제 해결 위한 프로토타입 */
  return PageSuspense.subscribe(
    <>
      <Main />

      <LayoutContainer className={styles.timelineContainer}>
        <SideMenu>
          {!isMobile && <SideMenu.Title>탐색하기</SideMenu.Title>}

          <SideMenu.Wrapper>
            <Link to={`${PAGE_LIST.TIMELINE}?sort=latest`}>
              <SideMenu.Item selected={true} icon={faPenNib}>
                최신글
              </SideMenu.Item>
            </Link>

            <Link to={`${PAGE_LIST.TIMELINE}?sort=trend`}>
              <SideMenu.Item icon={faArrowTrendUp}>트랜딩</SideMenu.Item>
            </Link>
          </SideMenu.Wrapper>
        </SideMenu>

        <ReviewTimelineContainer />
      </LayoutContainer>
    </>,
  );
}

export default MainPage;
