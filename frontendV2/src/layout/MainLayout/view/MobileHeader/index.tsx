import { useRecoilValue } from 'recoil';
import { pageTitleAtom } from 'recoil/pageTitle';

import { Text } from 'common/components';

import styles from './styles.module.scss';

function MobileHeader() {
  const pageTitle = useRecoilValue(pageTitleAtom);

  return (
    <Text as="h1" className={styles.mobileHeader} weight="bold">
      {pageTitle}
    </Text>
  );
}

export default MobileHeader;
