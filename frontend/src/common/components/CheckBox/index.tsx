import cn from 'classnames';

import styles from './styles.module.scss';

import FlexContainer from '../FlexContainer';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children: string;
}

function CheckBox({ className, children, ...rest }: CheckboxProps) {
  return (
    <label className={cn(styles.componentCheckbox, className)}>
      <input type="checkbox" className={styles.input} {...rest} />

      <FlexContainer className={styles.checkbox} align="center" justify="center">
        <FontAwesomeIcon className={styles.icon} icon={faCheck} />
      </FlexContainer>

      <div className={styles.text}>{children}</div>
    </label>
  );
}

export default CheckBox;
