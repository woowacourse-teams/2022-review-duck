import React, { useState } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import { TransitionDiv, Icon, Text } from 'common/components';

import styles from './styles.module.scss';

const propThemeType = ['primary', 'success', 'warning', 'danger'] as const;

export interface SnackbarProps {
  icon?: string;
  theme?: typeof propThemeType[number];
  title: string;
  description?: string;
  duration?: number;
  onDisappear?: React.AnimationEventHandler<HTMLDivElement>;
}

function Snackbar({
  icon = 'info',
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
      className={cn(styles.container, styles[theme])}
      appear="drop"
      disappear="drop"
      direction="right"
      duration={500}
      onClick={onProgressEnd}
      onDisappear={onDisappearContainer}
      isVisible={isVisible}
    >
      <div className={styles.content}>
        <Icon className={styles.icon} type="outlined" code={icon} />

        <div className={styles.text}>
          <Text className={styles.title} size={16} weight="bold">
            {title}
          </Text>
          <Text className={styles.description} size={14}>
            {description}
          </Text>
        </div>

        <Icon className={styles.close} code="close" />
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

Snackbar.propTypes = {
  icon: PropTypes.string,
  theme: PropTypes.oneOf(propThemeType),
  title: PropTypes.string,
  description: PropTypes.string,
  duration: PropTypes.number,
  onDisappear: PropTypes.func,
};

Snackbar.defaultType = {
  icon: 'circle_notifications',
  theme: 'primary',
  title: '스낵바 타이틀이 비어있습니다',
  duration: 3000,
};

export default Snackbar;
