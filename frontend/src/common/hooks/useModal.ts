import { useResetRecoilState, useSetRecoilState } from 'recoil';

import modalAtom from 'common/recoil/modal';

function useModal<TModalContentList>() {
  const setModal = useSetRecoilState(modalAtom);
  const resetModal = useResetRecoilState(modalAtom);

  const showModal = (key: TModalContentList, props: Record<string, unknown> = {}) => {
    if (typeof key !== 'string') {
      throw new Error('Modal Key는 문자열만 입력할 수 있습니다.');
    }

    setModal({ key, isVisible: true, props: { ...props } });
  };

  const hideModal = () => {
    resetModal();
  };

  return { showModal, hideModal };
}

export default useModal;
