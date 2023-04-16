import styles from './styles.module.scss';

export interface ButtonGroupProps {
  children: React.ReactNode;
}

function ButtonGroup({ children }: ButtonGroupProps) {
  return <div className={styles.componentButtonGroup}>{children}</div>;
}

export default ButtonGroup;
