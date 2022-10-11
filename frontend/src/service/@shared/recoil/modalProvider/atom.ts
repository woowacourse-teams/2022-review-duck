import { atom } from 'recoil';

import * as modals from 'service/@shared/components/ModalProvider/modals';

export interface ModalAtom {
  key?: keyof typeof modals;
  isVisible: boolean;
  props?: Record<string, unknown>;
}

const modalAtom = atom<ModalAtom>({
  key: 'modal',
  default: {
    isVisible: false,
    props: {},
  },
});

export default modalAtom;
