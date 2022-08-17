import cn from 'classnames';
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
      <div
        className={cn(styles.profile, styles[`profile-${size}`])}
        style={{ backgroundImage: `url(${profileUrl})` }}
      />
      <div className={cn(styles.userInfoContainer, styles[`user-info-container-${size}`])}>
        <Text className={cn(styles.primary, styles[`primary-${size}`])} weight="bold">
          {primaryText}
        </Text>
        <Text className={cn(styles.secondary, styles[`secondary-${size}`])}>{secondaryText}</Text>
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
