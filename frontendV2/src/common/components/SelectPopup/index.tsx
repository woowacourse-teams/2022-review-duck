import { useState } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

export interface SelectPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'left' | 'right';
  fallback: JSX.Element;
  focusEffect?: boolean;
  children: React.ReactNode;
}

function SelectPopup({
  className,
  justify = 'left',
  fallback,
  focusEffect: blurEffect = true,
  children,
  ...args
}: SelectPopupProps) {
  const [isPopupEnabled, setPopupEnabled] = useState(false);

  const handleToggleSelectBox = () => {
    setPopupEnabled(!isPopupEnabled);
  };

  return (
    <div className={styles.componentSelectPopup}>
      <div className={styles.opener} onClick={handleToggleSelectBox}>
        {fallback}
      </div>

      {blurEffect && isPopupEnabled && (
        <div className={styles.dimmer} onClick={handleToggleSelectBox} />
      )}
      <div
        className={cn(className, styles.selectPopup, styles[`justify-${justify}`], {
          [styles.enabled]: isPopupEnabled,
        })}
        onClick={handleToggleSelectBox}
        {...args}
      >
        {children}
      </div>
    </div>
  );
}

export default SelectPopup;
