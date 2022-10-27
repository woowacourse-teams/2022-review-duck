import { useSetRecoilState } from 'recoil';

import * as modals from './modals';
import modalAtom from 'service/recoil/modalProvider';

export interface ShowModal<TargetName extends keyof typeof modals> {
  key: TargetName;
  props?: Parameters<typeof modals[TargetName]>[0];
}

function useModal() {
  const setModalState = useSetRecoilState(modalAtom);

  const showModal = <T extends keyof typeof modals>({ key, props }: ShowModal<T>) => {
    setModalState({
      key,
      isVisible: true,
      props: props || {},
    });
  };

  const hideModal = () => {
    setModalState((currentValue) => ({
      ...currentValue,
      isVisible: false,
    }));
  };

  return { show: showModal, hide: hideModal };
}

export default useModal;
