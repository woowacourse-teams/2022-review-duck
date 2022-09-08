import { ReactNode } from 'react';

import cn from 'classnames';

import Icon from 'common/components/Icon';

import styles from './styles.module.scss';

const propSizeType = ['medium', 'large'] as const;

interface Props {
  className?: string;
  size: typeof propSizeType[number];
  title: string;
  description?: string;
  children: ReactNode;
}

function FieldSet({ className, size, title, description, children }: Props) {
  return (
    <div className={cn(className, styles.container, styles[`size-${size}`])}>
      <label className={cn(styles.title)}>{title}</label>

      {children}

      {description && (
        <div className={cn(styles.description)}>
          <Icon code="chevron_right" />
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}

FieldSet.defaultProps = {
  size: 'medium',
};

export default FieldSet;
