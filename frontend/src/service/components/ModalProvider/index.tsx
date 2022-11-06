import React from 'react';

import modalAtom from 'service/recoil/modalProvider';

import { useRecoilState } from 'recoil';

import { Modal } from 'common/components';

import * as modals from './modals';

function ModalProvider() {
  const [modalState, setModal] = useRecoilState(modalAtom);

  const { key: modalKey, isVisible } = modalState;

  const ModalContent = modalKey ? modals[modalKey] : React.Fragment;

  const handleClose = ({ target, currentTarget }: React.MouseEvent) => {
    const isCapturing = target !== currentTarget;

    if (isCapturing) return;

    setModal((currentState) => ({ ...currentState, isVisible: false }));
  };

  return (
    <div id="modal-container">
      <Modal visible={isVisible} onCloseModal={handleClose}>
        <ModalContent />
      </Modal>
    </div>
  );
}

export default ModalProvider;
