import DefaultLogo from 'assets/svg/logo_filled_bold.svg';
import cn from 'classnames';
import styles from './styles.module.scss';

function Logo({}) {
  return <img className={cn(styles.logo)} src={DefaultLogo} alt="로고"></img>;
}

export default Logo;
