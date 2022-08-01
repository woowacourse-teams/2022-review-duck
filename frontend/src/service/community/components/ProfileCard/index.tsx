import PropTypes from 'prop-types';

import { Text, Icon } from 'common/components';

import imageRuna from 'assets/images/runa.jpg';

import styles from './styles.module.scss';

interface Props {
  user: {
    profileUrl: string;
    githubNickname: string;
    githubStatus: string;
    nickname: string;
    numberOfReviews: number;
    numberOfRevieForms: number;
  };
}

const ProfileCard = ({ user }: Props) => {
  return (
    <section className={styles.header} style={{ backgroundImage: 'url(' + imageRuna + ')' }}>
      <div className={styles.background} />

      <div className={styles.profileImage} style={{ backgroundImage: 'url(' + imageRuna + ')' }}>
        <div className={styles.statusImage}>🌙</div>
      </div>

      <div className={styles.userInfoContainer}>
        <div className={styles.nameContainer}>
          <Text className={styles.name} size={24} weight="bold">
            {user.nickname}
          </Text>
          <Icon className={styles.editIcon} code="edit_note"></Icon>
        </div>

        <Text className={styles.name} size={14}>
          {user.githubNickname}
        </Text>

        <div className={styles.line} />

        <div className={styles.reviewInfoContainer}>
          <div className={styles.reviewInfo}>
            <div className={styles.titleContainer}>
              <Icon className={styles.icon} code="edit_note"></Icon>
              <Text size={14}>작성한 회고</Text>
            </div>
            <div className={styles.number}>{user.numberOfReviews}</div>
          </div>

          <div className={styles.reviewInfo}>
            <div className={styles.titleContainer}>
              <Icon className={styles.icon} code="post_add"></Icon>
              <Text size={14}>생성한 회고</Text>
            </div>
            <div className={styles.number}>{user.numberOfRevieForms}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.shape({
    profileUrl: PropTypes.string.isRequired,
    githubNickname: PropTypes.string.isRequired,
    githubStatus: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    numberOfReviews: PropTypes.number.isRequired,
    numberOfRevieForms: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProfileCard;
