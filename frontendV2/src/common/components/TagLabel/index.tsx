import { ReactNode } from 'react';

import cn from 'classnames';

import FlexContainer from '../FlexContainer';

import styles from './styles.module.scss';

interface TagLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

function TagLabel({ className, children, ...rest }: TagLabelProps) {
  return (
    <FlexContainer className={cn(className, styles.componentTagLabel)} direction="row" {...rest}>
      {children}
    </FlexContainer>
  );
}

export default TagLabel;
