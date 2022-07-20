import cn from 'classnames';

import { Text } from 'common/components';

import styles from './styles.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type: 'square' | 'round';
  image: string;
  title: string;
  description: string;
}

function Profile({ type, image, title, description, ...rest }: Props) {
  return (
    <div className={cn(styles.container, styles[type])} {...rest}>
      <div className={styles.image} style={{ backgroundImage: 'url(' + image + ')' }} />

      {type === 'square' && (
        <div className={styles.text}>
          <Text className={styles.title} size={14}>
            {title}
          </Text>
          <Text className={styles.description} size={12}>
            {description}
          </Text>
        </div>
      )}

      {type === 'round' && (
        <div className={styles.text}>
          <h4 className={styles.title}>{title}</h4>
          <Text className={styles.description} size={14}>
            {description}
          </Text>
        </div>
      )}
    </div>
  );
}

Profile.defaultProps = {
  type: 'square',
  image: '',
  title: '타이틀',
  description: '설명',
};

export default Profile;
