import React, { useContext, useState } from 'react';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UserAgentContext } from 'common/contexts/UserAgent';

import cn from 'classnames';

import { TransitionDiv, Text } from 'common/components';

import styles from './styles.module.scss';

export interface SnackbarProps {
  icon?: IconProp;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  title?: string;
  description?: string;
  duration?: number;
  onDisappear?: React.AnimationEventHandler<HTMLDivElement>;
}

function Snackbar({
  icon = faBell,
  theme = 'primary',
  title = '스낵바 타이틀이 비어있습니다',
  description,
  duration = 3000,
  onDisappear,
}: SnackbarProps) {
  const { isPC } = useContext(UserAgentContext);
  const [isVisible, setVisible] = useState(true);

  const progressDuration = `${(duration / 1000).toFixed(2)}s`;

  const handleHideSnackbar = ({
    type,
    target,
    currentTarget,
  }: React.MouseEvent | React.AnimationEvent) => {
    if (type === 'animationend' && target !== currentTarget) return;

    setVisible(false);
  };

  const handleDisappear = (event: React.AnimationEvent<HTMLDivElement>) => {
    onDisappear && onDisappear(event);
  };

  return (
    <TransitionDiv
      className={cn(styles.componentSnackbar, styles[theme])}
      all="drop"
      direction={isPC ? 'right' : 'up'}
      duration={500}
      onClick={handleHideSnackbar}
      onDisappear={handleDisappear}
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
          onAnimationEnd={handleHideSnackbar}
          style={{ animationDuration: progressDuration }}
        ></div>
      </div>
    </TransitionDiv>
  );
}

export default Snackbar;
