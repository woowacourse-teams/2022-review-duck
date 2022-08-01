import { selector } from 'recoil';

import snackbarStackAtom from './atom';

export const snackbarStackWithActive = selector({
  key: 'snackbarStackWithActive',
  get: ({ get }) => [...get(snackbarStackAtom)].splice(0, 3),
});
