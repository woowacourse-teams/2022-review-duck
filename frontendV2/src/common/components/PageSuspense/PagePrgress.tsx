import { useContext } from 'react';

import { API_REQUEST_TIMEOUT } from 'constant';

import ProgressBar from '../ProgressBar';
import { IsPageLoadedContext } from './Provider';

import styles from './styles.module.scss';

function PageProgress() {
  const isPageLoaded = useContext(IsPageLoadedContext);

  return (
    <ProgressBar
      className={styles.progress}
      animation={isPageLoaded ? 'done' : 'play'}
      duration={`${API_REQUEST_TIMEOUT / 1000}s`}
    />
  );
}

export default PageProgress;
