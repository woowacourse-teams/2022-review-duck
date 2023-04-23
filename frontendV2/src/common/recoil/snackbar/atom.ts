import { atom } from 'recoil';

import { SnackbarProps } from 'common/components/Snackbar/component';

interface SnackbarStackAtom extends SnackbarProps {
  key: number;
}

export interface SnackbarAtom {
  uniqueKey: number;
  stack: SnackbarStackAtom[];
}

const snackbarStackAtom = atom<SnackbarAtom>({
  key: 'snackbarStack',
  default: {
    uniqueKey: 0,
    stack: [],
  },
});

export default snackbarStackAtom;
