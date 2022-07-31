import cn from 'classnames';
import PropTypes from 'prop-types';

import LogoBold from 'assets/images/logo-bold.svg';
import LogoBorderBold from 'assets/images/logo-border-bold.svg';
import LogoBorderDefault from 'assets/images/logo-border-default.svg';
import LogoDefault from 'assets/images/logo-default.svg';

import styles from './styles.module.scss';

const propThemeType = ['filled', 'border'] as const;
const propWeightType = ['normal', 'bold'] as const;
const propSizeType = ['small', 'medium', 'large'] as const;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  theme: typeof propThemeType[number];
  weight: typeof propWeightType[number];
  size: typeof propSizeType[number];
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

function Logo({ theme, weight, size, ...rest }: Props) {
  const TargetLogo = LOGO_LIST[theme][weight];

  return (
    <div className={cn(styles[size])} {...rest}>
      <TargetLogo className={cn(styles.logo)} />
    </div>
  );
}

Logo.propTypes = {
  theme: PropTypes.oneOf(propThemeType),
  weight: PropTypes.oneOf(propWeightType),
  size: PropTypes.oneOf(propSizeType),
};

Logo.defaultProps = {
  theme: 'filled',
  weight: 'bold',
  size: 'medium',
};

export default Logo;
