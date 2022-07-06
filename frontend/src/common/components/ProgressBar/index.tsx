import cn from 'classnames';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

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
