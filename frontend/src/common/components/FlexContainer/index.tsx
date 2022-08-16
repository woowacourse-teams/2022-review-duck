import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement | HTMLFormElement> {
  direction: 'row' | 'column' | 'rows-reverse' | 'column-reverse';
  justify?: 'left' | 'center' | 'right' | 'space-between';
  align?: 'start' | 'center' | 'end';
  gap?: 'small' | 'medium' | 'large' | 'xlarge';
}

function FlexContainer({ className, direction, justify, align, gap, children, ...rest }: Props) {
  const classNames = cn(
    className,
    styles.container,
    styles[`direction-${direction}`],
    styles[`justify-${justify}`],
    styles[`align-${align}`],
    styles[`gap-${gap}`],
  );

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
}

FlexContainer.defaultProps = {
  direction: 'column',
};

export default FlexContainer;
