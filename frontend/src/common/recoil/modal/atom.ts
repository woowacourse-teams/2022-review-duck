import { atom } from 'recoil';

export interface ModalAtom<TModalContentKey = string> {
  key: TModalContentKey;
  isVisible: boolean;
  props?: Record<string, unknown>;
}

const modalAtom = atom<ModalAtom>({
  key: 'modal',
  default: {
    key: '',
    isVisible: false,
    props: {},
  },
});

export default modalAtom;
