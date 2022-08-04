import cn from 'classnames';
import PropTypes from 'prop-types';

import { Logo } from 'common/components';

import styles from './styles.module.scss';

const propSizeType = ['small', 'medium', 'large'] as const;

interface Props {
  className?: string;
  size: typeof propSizeType[number];
  children: string;
}

function NoResult({ className, size, children }: Props) {
  return (
    <div className={cn(className, styles.container)}>
      <Logo className={styles.logo} theme="border" size={size} weight="normal" />
      <span className={cn(styles[size], styles.title)}>{children}</span>
    </div>
  );
}

NoResult.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(propSizeType),
  children: PropTypes.string.isRequired,
};

NoResult.defaultProps = {
  size: 'medium',
  children: '결과가 없습니다.',
};

export default NoResult;
