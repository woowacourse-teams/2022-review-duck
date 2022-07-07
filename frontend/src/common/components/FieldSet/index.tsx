import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import cn from 'classnames';
import Icon from 'common/components/Icon';
import styles from './styles.module.scss';

interface Props {
  size: 'large' | 'medium';
  title: string;
  description?: string;
  children: ReactNode;
}

function FieldSet({ title, description, children }: Props) {
  return (
    <div className={cn(styles.container)}>
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
  size: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.element.isRequired,
};

FieldSet.defaultProps = {
  size: 'medium',
  description: '',
};

export default FieldSet;
