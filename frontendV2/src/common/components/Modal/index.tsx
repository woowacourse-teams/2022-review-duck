import React, { useLayoutEffect, useState } from 'react';

import TransitionDiv from '../TransitionDiv';

import styles from './styles.module.scss';

interface ModalProps {
  visible: boolean;
  onCloseModal: React.MouseEventHandler;
  children: React.ReactNode;
}

function Modal({ visible, onCloseModal, children }: ModalProps) {
  const [isDimmerVisible, setDimmerVisible] = useState(visible);

  useLayoutEffect(
    function visibleStateDetection() {
      setDimmerVisible(visible);
    },
    [visible],
  );

  const handleHideDimmer = () => {
    setDimmerVisible(false);
  };

  return (
    <TransitionDiv
      className={styles.componentModal}
      all="fade"
      duration={200}
      visible={isDimmerVisible}
      onClick={onCloseModal}
    >
      <TransitionDiv
        className={styles.container}
        all="drop"
        duration={300}
        direction="up"
        visible={visible}
        onDisappear={handleHideDimmer}
      >
        {children}
      </TransitionDiv>
    </TransitionDiv>
  );
}

export default Modal;
