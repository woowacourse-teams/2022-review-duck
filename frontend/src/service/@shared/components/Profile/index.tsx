import { Link } from 'react-router-dom';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';

import { getChildComponent } from 'service/@shared/utils';

import { Text } from 'common/components';

import FlexContainer, { FlexContainerProps } from 'common/components/FlexContainer';
import { TextProps } from 'common/components/Text';

import styles from './styles.module.scss';

interface ImageProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  theme?: 'rounded' | 'rectangle';
  edge?: 'round' | 'pointed';
  src?: string;
}

function Image({
  className,
  size = 'medium',
  theme = 'rectangle',
  edge = 'round',
  src = '',
}: ImageProps) {
  const sizeToPixel = {
    small: 48,
    medium: 64,
    large: 96,
  };
  const imageSrcURL = new URL(src);

  imageSrcURL.searchParams.set('size', String(sizeToPixel[size] * 2));

  return (
    <div
      className={cn(
        className,
        styles.profileImage,
        styles[`size-${size}`],
        styles[`theme-${theme}`],
        styles[`edge-${edge}`],
      )}
      style={{ backgroundImage: `url(${imageSrcURL.toString()})` }}
    />
  );
}

interface ProfileTextProps extends Partial<Pick<TextProps, 'size'>> {
  className?: string;
  children?: string;
}

function Nickname({ className, size = 16, children }: ProfileTextProps) {
  return (
    <Text className={cn(className, styles.nickname)} size={size} weight="bold">
      {children}
    </Text>
  );
}

function Description({ className, size = 14, children }: ProfileTextProps) {
  return (
    <Text className={cn(className, styles.description)} size={size} weight="lighter">
      {children}
    </Text>
  );
}

interface ContainerProps extends Partial<FlexContainerProps> {
  socialId: number;
  textAlign?: 'left' | 'center' | 'right';
  textGap?: Pick<FlexContainerProps, 'gap'>['gap'];
  children: React.ReactNode;
}

function ProfileContainer({
  className,
  socialId,
  direction = 'column',
  justify,
  align,
  gap = 'medium',
  textAlign = 'left',
  textGap = 'small',
  children,
}: ContainerProps) {
  const profileImage = getChildComponent(children, <Image />);
  const nickname = getChildComponent(children, <Nickname />);
  const description = getChildComponent(children, <Description />);

  const userProfileURL = `${PAGE_LIST.USER_PROFILE}/${socialId}`;

  return (
    <FlexContainer
      className={cn(className, styles.profileContainer, styles[`align-${textAlign}`])}
      direction={direction}
      justify={justify}
      align={align}
      gap={gap}
    >
      <Link to={userProfileURL}>{profileImage}</Link>

      <FlexContainer className={styles.text} direction="column" justify="center" gap={textGap}>
        <Link to={userProfileURL}>{nickname}</Link>
        {description}
      </FlexContainer>
    </FlexContainer>
  );
}

const Profile = Object.assign(ProfileContainer, {
  Image,
  Nickname,
  Description,
});

export default Profile;
