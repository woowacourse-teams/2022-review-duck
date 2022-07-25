import cn from 'classnames';

import styles from './styles.module.scss';

interface Props {
  type?: 'round' | 'outlined' | 'sharp' | 'two-tone';
  code: string;
}

function Icon({ type, code }: Props) {
  return <span className={cn('icon', styles.icon, `material-icons-${type}`)}>{code}</span>;
}

Icon.defaultProps = {
  type: 'round',
};

export default Icon;
