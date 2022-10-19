import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { FlexContainer, Text } from 'common/components';

import Carousel from 'common/components/Carousel';

import Profile from 'service/@shared/components/Profile';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return <Carousel className={styles.componentPageTrending}>{children}</Carousel>;
}

interface ProfileCardProps {
  snsKey: number;
  profileImage: URLString;
  nickname: string;
  description: string;
}

function ProfileCard({ snsKey, profileImage, nickname, description }: ProfileCardProps) {
  return (
    <FlexContainer
      className={cn(styles.card, styles.profileCard)}
      align="center"
      justify="center"
      gap="medium"
      style={{ backgroundImage: `url(${profileImage})` }}
    >
      <Text className={styles.title} weight="lighter">
        Creator
      </Text>

      <Profile
        className={styles.profile}
        socialId={snsKey}
        align="center"
        gap="large"
        textGap="medium"
        textAlign="center"
      >
        <Profile.Image className={styles.image} theme="rounded" src={profileImage} />
        <Profile.Nickname className={styles.name} size={20}>
          {nickname}
        </Profile.Nickname>
        <Profile.Description className={styles.description} size={16}>
          {description}
        </Profile.Description>
      </Profile>
    </FlexContainer>
  );
}

interface ListTextCardProps {
  icon: IconDefinition;
  description: string;
  children: string;
}

function ListTextCard({ icon, description, children }: ListTextCardProps) {
  return (
    <FlexContainer
      className={cn(styles.card, styles.listTextCard)}
      align="center"
      justify="center"
      gap="medium"
    >
      <FontAwesomeIcon className={styles.icon} icon={icon} />
      <Text className={styles.title} weight="bold" size={20}>
        {children}
      </Text>
      <Text className={styles.description} weight="lighter">
        {description}
      </Text>
    </FlexContainer>
  );
}

const Trending = Object.assign(Container, {
  ProfileCard,
  ListTextCard,
});

export default Trending;
