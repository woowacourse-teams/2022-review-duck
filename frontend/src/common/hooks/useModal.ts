import { useSetRecoilState } from 'recoil';

import modalAtom from 'common/recoil/modal';

function useModal<TModalContentList>() {
  const setModalState = useSetRecoilState(modalAtom);
  const showModal = (key: TModalContentList, props: Record<string, unknown> = {}) => {
    if (typeof key !== 'string') {
      throw new Error('Modal Key는 문자열만 입력할 수 있습니다.');
    }

    setModalState({
      key,
      isVisible: true,
      props: { ...props },
    });
  };

  const hideModal = () => {
    setModalState((currentValue) => ({
      ...currentValue,
      isVisible: false,
    }));
  };

  return { showModal, hideModal };
}

export default useModal;
