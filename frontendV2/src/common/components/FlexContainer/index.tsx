import React from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';

export interface FlexContainerProps extends React.HTMLAttributes<HTMLDivElement | HTMLFormElement> {
  as?: 'div' | 'ul' | 'section' | 'header' | 'main' | 'footer' | 'aside' | 'form';
  direction?: 'row' | 'column' | 'rows-reverse' | 'column-reverse';
  justify?: 'left' | 'center' | 'right' | 'space-between';
  align?: 'start' | 'center' | 'end';
  gap?: 'small' | 'medium' | 'large' | 'xlarge';
}

function FlexContainer(
  {
    as = 'div',
    className,
    direction = 'column',
    justify,
    align,
    gap,
    children,
    ...rest
  }: FlexContainerProps,
  ref?: React.ForwardedRef<unknown>,
) {
  const classNames = cn(
    className,
    styles.container,
    styles[`direction-${direction}`],
    styles[`justify-${justify}`],
    styles[`align-${align}`],
    styles[`gap-${gap}`],
  );

  return React.createElement(as, { ref, className: classNames, ...rest }, children);
}

export default React.forwardRef(FlexContainer);
