import { useRecoilValue } from 'recoil';

import { Text } from 'common/components';

import styles from './styles.module.scss';

import { pageTitleAtom } from 'recoil/pageTitle';

function MobileHeader() {
  const pageTitle = useRecoilValue(pageTitleAtom);

  return (
    <Text as="h1" className={styles.mobileHeader} weight="bold">
      {pageTitle}
    </Text>
  );
}

export default MobileHeader;
