import * as modals from 'components/ModalProvider/modals';
import { atom } from 'recoil';

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
