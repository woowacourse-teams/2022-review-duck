import React, { useState } from 'react';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { TransitionDiv, Text } from 'common/components';

import styles from './styles.module.scss';

export interface SnackbarProps {
  icon?: IconProp;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  title: string;
  description?: string;
  duration?: number;
  onDisappear?: React.AnimationEventHandler<HTMLDivElement>;
}

function Snackbar({
  icon = faBell,
  theme = 'primary',
  title,
  description,
  duration = 3000,
  onDisappear,
}: SnackbarProps) {
  const [isVisible, setVisible] = useState(true);

  const progressDuration = `${(duration / 1000).toFixed(2)}s`;

  const onProgressEnd = ({
    type,
    target,
    currentTarget,
  }: React.MouseEvent | React.AnimationEvent) => {
    if (type === 'animationend' && target !== currentTarget) return;

    setVisible(false);
  };

  const onDisappearContainer = (event: React.AnimationEvent<HTMLDivElement>) => {
    onDisappear && onDisappear(event);
  };

  return (
    <TransitionDiv
      className={cn(styles.componentSnackbar, styles[theme])}
      all="drop"
      direction="right"
      duration={500}
      onClick={onProgressEnd}
      onDisappear={onDisappearContainer}
      isVisible={isVisible}
    >
      <div className={styles.content}>
        <FontAwesomeIcon className={styles.icon} icon={icon} />

        <div className={styles.text}>
          <Text className={styles.title} size={18} weight="bold">
            {title}
          </Text>
          {description && (
            <Text className={styles.description} size={14}>
              {description}
            </Text>
          )}
        </div>

        <FontAwesomeIcon className={styles.close} icon={faClose} />
      </div>

      <div className={styles.progress}>
        <div
          className={styles.percent}
          onAnimationEnd={onProgressEnd}
          style={{ animationDuration: progressDuration }}
        ></div>
      </div>
    </TransitionDiv>
  );
}

Snackbar.defaultType = {
  icon: faBell,
  theme: 'primary',
  title: '스낵바 타이틀이 비어있습니다',
  duration: 3000,
};

export default Snackbar;
