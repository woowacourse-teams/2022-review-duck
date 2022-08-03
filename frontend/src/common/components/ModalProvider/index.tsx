import { useRecoilState } from 'recoil';

import Modal from '../Modal';
import modalAtom from 'common/recoil/modal';

interface Props {
  contentList: Record<string, (props: unknown) => JSX.Element>;
}

function ModalProvider({ contentList }: Props) {
  const [modalState, setModal] = useRecoilState(modalAtom);

  const { key: modalKey, isVisible } = modalState;

  const ModalContent = contentList[modalKey];

  const onCloseModal = () => {
    setModal((currentState) => ({ ...currentState, isVisible: false }));
  };

  return (
    <div id="modal-container">
      <Modal isVisible={isVisible} onCloseModal={onCloseModal}>
        {ModalContent ? (
          <ModalContent />
        ) : (
          <p>찾을 수 없는 모달 컨텐츠입니다. 모달 Key를 확인해주세요.</p>
        )}
      </Modal>
    </div>
  );
}

export default ModalProvider;
