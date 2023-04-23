import cn from 'classnames';

import styles from './styles.module.scss';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
  animation?: 'play' | 'done' | 'pending' | 'unset';
  duration?: `${number}s`;
}

function ProgressBar({
  className,
  percent = 0,
  animation = 'unset',
  duration = '0s',
  ...args
}: ProgressBarProps) {
  return (
    <div
      className={cn(className, styles.componentProgressBar, styles[`animation-${animation}`])}
      {...args}
    >
      <div
        className={cn(styles.percent)}
        style={{
          width: `${percent}%`,
          animationDuration: animation === 'play' ? duration : '',
        }}
      ></div>
    </div>
  );
}

export default ProgressBar;
