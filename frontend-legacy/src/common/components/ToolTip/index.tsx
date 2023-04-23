import cn from 'classnames';

import styles from './styles.module.scss';

export interface ToolTipProps {
  className?: string;
  text: string;
  align: 'top' | 'bottom' | 'left' | 'right';
  disabled: boolean;
  children: React.ReactNode;
}

function ToolTip({ className, text, align, disabled, children }: ToolTipProps) {
  const toolTipBoxClassNames = cn(styles.tooltipBox, styles[`align-${align}`], {
    [styles.disabled]: disabled,
  });

  return (
    <div className={cn(styles.componentTooltip, className)}>
      <div className={toolTipBoxClassNames}>{text}</div>
      {children}
    </div>
  );
}

ToolTip.defaultProps = {
  disabled: false,
  align: 'top',
};

export default ToolTip;
