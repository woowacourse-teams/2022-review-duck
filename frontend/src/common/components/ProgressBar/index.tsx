import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

interface Props {
  percent: number;
}

function ProgressBar({ percent }: Props) {
  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.progress)} style={{ width: `${percent}%` }}></div>
    </div>
  );
}

ProgressBar.propTypes = {
  percent: PropTypes.number,
};

ProgressBar.defaultProps = {
  percent: 0,
};

export default ProgressBar;
