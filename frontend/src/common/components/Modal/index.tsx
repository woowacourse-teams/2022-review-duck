import React, { useLayoutEffect, useState } from 'react';

import TransitionDiv from '../TransitionDiv';

import styles from './styles.module.scss';

interface ModalProps {
  isVisible: boolean;
  onCloseModal: React.MouseEventHandler;
  children: React.ReactNode;
}

function Modal({ isVisible, onCloseModal, children }: ModalProps) {
  const [isDimmerVisible, setDimmerVisible] = useState(isVisible);

  useLayoutEffect(() => {
    setDimmerVisible(isVisible);
  }, [isVisible]);

  const onDisappearContainer = () => {
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
        visible={isVisible}
        onDisappear={onDisappearContainer}
      >
        {children}
      </TransitionDiv>
    </TransitionDiv>
  );
}

export default Modal;
