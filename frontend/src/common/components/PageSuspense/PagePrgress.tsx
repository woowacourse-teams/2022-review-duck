import { useRecoilValue } from 'recoil';

import { API_REQUEST_TIMEOUT } from 'constant';

import ProgressBar from '../ProgressBar';
import { pageLoadedAtom } from './store';

import styles from './styles.module.scss';

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
