import cn from 'classnames';
import PropTypes from 'prop-types';

import { Logo } from 'common/components';

import styles from './styles.module.scss';

const propSizeType = ['small', 'medium', 'large'] as const;

interface Props {
  className?: string;
  size?: typeof propSizeType[number];
  title?: string;
}

function NoResult({ className, size = 'medium', title = '결과가 없습니다.' }: Props) {
  return (
    <div className={cn(className, styles.container)}>
      <Logo theme="border" size={size} />
      <span className={cn(styles[size], styles.title)}>{title}</span>
    </div>
  );
}

NoResult.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(propSizeType),
  title: PropTypes.string.isRequired,
};

NoResult.defaultProps = {
  size: 'medium',
  title: '결과가 없습니다.',
};

export default NoResult;
