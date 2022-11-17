import PageSuspense from 'common/components/PageSuspense';

import Main from './container/Main';
import Timeline from './container/Timeline';

function MainPage() {
  /* network waterfall 문제 해결 위한 프로토타입 */
  return PageSuspense.subscribe(
    <>
      <Main />
      <Timeline />
    </>,
  );
}

export default MainPage;
