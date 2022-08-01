import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const propSizeType = [12, 14, 16, 18, 20, 24, 32, 40, 48] as const;

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  size: typeof propSizeType[number];
  weight: 'lighter' | 'normal' | 'bold';
  children: React.ReactNode;
}

function Text({ className, size, weight, children, ...rest }: Props) {
  return (
    <p className={cn(className, styles[`size-${size}`], styles[`weight-${weight}`])} {...rest}>
      {children}
    </p>
  );
}

Text.propTypes = {
  size: PropTypes.oneOf(propSizeType),
};

Text.defaultProps = {
  size: 14,
  weight: 'normal',
};

export default Text;
