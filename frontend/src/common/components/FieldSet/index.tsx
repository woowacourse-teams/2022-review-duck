import { ReactNode } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'common/components/Icon';

import styles from './styles.module.scss';

const sizeProps = ['medium', 'large'] as const;

interface Props {
  className?: string;
  size: typeof sizeProps[number];
  title: string;
  description?: string;
  children: ReactNode;
}

function FieldSet({ size, title, description, children }: Props) {
  return (
    <div className={cn(styles.container, styles[`size-${size}`])}>
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

FieldSet.propTypes = {
  size: PropTypes.oneOf(sizeProps),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.element.isRequired,
};

FieldSet.defaultProps = {
  size: 'medium',
};

export default FieldSet;
