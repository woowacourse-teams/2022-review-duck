import cn from 'classnames';

import styles from './styles.module.scss';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
  autoFill: boolean;
  duration?: `${number}s`;
}

function ProgressBar({ className, percent, autoFill, duration, ...args }: ProgressBarProps) {
  return (
    <div className={cn(className, styles.componentProgressBar)} {...args}>
      <div
        className={cn(styles.percent, { [styles.animation]: autoFill })}
        style={{ width: `${percent}%`, animationDuration: duration }}
      ></div>
    </div>
  );
}

ProgressBar.defaultProps = {
  autoFill: false,
  percent: 0,
  duration: '1s',
};

export default ProgressBar;
