import cn from 'classnames';

import LogoBold from 'assets/images/logo-bold.svg';
import LogoBorderBold from 'assets/images/logo-border-bold.svg';
import LogoBorderDefault from 'assets/images/logo-border-default.svg';
import LogoDefault from 'assets/images/logo-default.svg';

import styles from './styles.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  theme: 'filled' | 'border';
  weight: 'normal' | 'bold';
  size: 'small' | 'medium' | 'large';
}

const LOGO_LIST = {
  filled: {
    normal: LogoDefault,
    bold: LogoBold,
  },
  border: {
    normal: LogoBorderDefault,
    bold: LogoBorderBold,
  },
};

function Logo({ className, theme, weight, size, ...rest }: Props) {
  const TargetLogo = LOGO_LIST[theme][weight];

  return (
    <div className={cn(styles[size])} {...rest}>
      <TargetLogo className={cn(styles.logo, className)} />
    </div>
  );
}

Logo.defaultProps = {
  theme: 'filled',
  weight: 'bold',
  size: 'medium',
};

export default Logo;
