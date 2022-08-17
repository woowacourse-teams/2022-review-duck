import { ReactNode } from 'react';

import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

function TagLabel({ className, children, ...rest }: Props) {
  return (
    <div className={cn(className, styles.tag)} {...rest}>
      <div className={styles.tagWrapper}>{children}</div>
    </div>
  );
}

TagLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default TagLabel;
