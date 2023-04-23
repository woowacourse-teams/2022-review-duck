import styles from './styles.module.scss';

function Skeleton({ line }: Record<'line', number>) {
  return (
    <>
      {Array.from({ length: line }).map((_, index) => (
        <div key={index} className={styles.container}>
          <div className={styles.image} />

          <div className={styles.text} />
          <div className={styles.text} />
        </div>
      ))}
    </>
  );
}

Skeleton.defaultProps = {
  line: 1,
};

export default Skeleton;
