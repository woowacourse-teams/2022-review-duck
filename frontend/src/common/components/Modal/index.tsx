import React, { useLayoutEffect, useState } from 'react';

import styles from './styles.module.scss';

import TransitionDiv from '../TransitionDiv';

interface Props {
  isVisible: boolean;
  onCloseModal: React.MouseEventHandler;
  children: React.ReactNode;
}

function Modal({ isVisible, onCloseModal, children }: Props) {
  const [isDimmerVisible, setDimmerVisible] = useState(isVisible);

  useLayoutEffect(() => {
    setDimmerVisible(isVisible);
  }, [isVisible]);

  const onDisappearContainer = () => {
    setDimmerVisible(false);
  };

  return (
    <TransitionDiv
      className={styles.dimmer}
      all="fade"
      duration={200}
      isVisible={isDimmerVisible}
      onClick={onCloseModal}
    >
      <TransitionDiv
        className={styles.container}
        all="drop"
        duration={300}
        direction="up"
        isVisible={isVisible}
        onDisappear={onDisappearContainer}
      >
        {children}
      </TransitionDiv>
    </TransitionDiv>
  );
}

export default Modal;
