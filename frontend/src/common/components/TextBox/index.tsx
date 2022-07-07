import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.module.scss';

const typeProps = ['default', 'underline'] as const;
const sizeProps = ['small', 'medium', 'large'] as const;

interface Props {
  className?: string;
  theme: typeof typeProps[number];
  size: typeof sizeProps[number];
  placeholder?: string;
}

function TextBox({ theme, className, size, placeholder, ...rest }: Props) {
  return (
    <input
      type="text"
      className={cn(className, styles.textBox, styles[`theme-${theme}`], styles[`size-${size}`])}
      placeholder={placeholder}
      {...rest}
    />
  );
}

TextBox.propTypes = {
  theme: PropTypes.oneOf(typeProps),
  size: PropTypes.oneOf(sizeProps),
};

TextBox.defaultProps = {
  theme: 'default',
  size: 'medium',
};

export default TextBox;
