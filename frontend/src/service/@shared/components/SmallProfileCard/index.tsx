import PropTypes from 'prop-types';

import { Text } from 'common/components';

import styles from './styles.module.scss';

const propSizeTypes = ['medium', 'large'] as const;

interface Props {
  size?: typeof propSizeTypes[number];
  profileUrl: string;
  primaryText: string;
  secondaryText: string;
}

function SmallProfileCard({ size = 'medium', primaryText, secondaryText, profileUrl }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.profile} style={{ backgroundImage: `url(${profileUrl})` }} />
      <div className={styles.userInfoContainer}>
        <Text className={styles.nickname} size={14} weight="bold">
          {primaryText}
        </Text>
        <Text className={styles.update} size={12}>
          {secondaryText}
        </Text>
      </div>
    </div>
  );
}

SmallProfileCard.propTypes = {
  size: PropTypes.oneOf(propSizeTypes),
  profileUrl: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

SmallProfileCard.defaultProps = {
  size: 'medium',
};

export default SmallProfileCard;
