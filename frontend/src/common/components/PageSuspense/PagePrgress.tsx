import { API_REQUEST_TIMEOUT } from 'constant';
import { useRecoilValue } from 'recoil';

import styles from './styles.module.scss';

import ProgressBar from '../ProgressBar';
import { pageLoadedAtom } from './store';

function PageProgress() {
  const isPageLoaded = useRecoilValue(pageLoadedAtom);

  return (
    <ProgressBar
      className={styles.progress}
      animation={isPageLoaded ? 'done' : 'play'}
      duration={`${API_REQUEST_TIMEOUT / 1000}s`}
    />
  );
}

export default PageProgress;
