import { useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faPenNib } from '@fortawesome/free-solid-svg-icons';

import { UserAgentContext } from 'common/contexts/UserAgent';
import LayoutContainer from 'components/LayoutContainer';

import PageSuspense from 'common/components/PageSuspense';

import { PAGE_LIST, FILTER } from 'constant';
import { isInclude } from 'utils';

import styles from './styles.module.scss';
import SideMenu from 'components/SideMenu';
import { ReviewTimelineContainer } from 'containers';

function ReviewTimelinePage() {
  const [searchParam] = useSearchParams();
  const { isMobile } = useContext(UserAgentContext);

  const filterQueryString = searchParam.get('sort');
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  return PageSuspense.subscribe(
    <LayoutContainer className={styles.container}>
      <SideMenu>
        {!isMobile && <SideMenu.Title>탐색하기</SideMenu.Title>}

        <SideMenu.Wrapper>
          <Link to={`${PAGE_LIST.TIMELINE}?sort=latest`}>
            <SideMenu.Item selected={currentTab === FILTER.TIMELINE_TAB.LATEST} icon={faPenNib}>
              최신글
            </SideMenu.Item>
          </Link>

          <Link to={`${PAGE_LIST.TIMELINE}?sort=trend`}>
            <SideMenu.Item selected={currentTab === FILTER.TIMELINE_TAB.TREND} icon={faArrowTrendUp}>
              트랜딩
            </SideMenu.Item>
          </Link>
        </SideMenu.Wrapper>
      </SideMenu>

      <ReviewTimelineContainer sort={currentTab} />
    </LayoutContainer>,
  );
}

export default ReviewTimelinePage;
