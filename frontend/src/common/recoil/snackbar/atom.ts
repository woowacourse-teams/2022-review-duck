import { atom } from 'recoil';

import { SnackbarAtom } from 'common/types';

const snackbarStackAtom = atom<SnackbarAtom>({
  key: 'snackbarStack',
  default: {
    uniqueKey: 0,
    stack: [],
  },
});

export default snackbarStackAtom;
