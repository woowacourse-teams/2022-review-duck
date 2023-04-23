import { FlexContainer, Text } from 'common/components';
import { Link } from 'react-router-dom';
import { UserProfileProps } from './types';
import { styled } from '@linaria/react';
import { PAGE_LIST } from 'constant';

import imageUserEmptyProfile from 'assets/images/profile.png';
import theme from 'styles/theme';

function DefaultUserProfile({
  socialId,
  image = imageUserEmptyProfile,
  nickname,
  description,
}: UserProfileProps) {
  const userProfilePageUrl = `${PAGE_LIST.USER_PROFILE}/${socialId}`;

  return (
    <FlexContainer direction="row" gap="medium">
      <Link to={userProfilePageUrl}>
        <ProfileImage src={image} alt="" />
      </Link>

      <FlexContainer direction="column" justify="center" gap="small">
        <Link to={userProfilePageUrl}>
          <Nickname size={16} weight="bold">
            {nickname}
          </Nickname>
        </Link>

        <Description size={14} weight="lighter">
          {description}
        </Description>
      </FlexContainer>
    </FlexContainer>
  );
}

const ProfileImage = styled.img`
  position: relative;
  display: block;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;

  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${theme.color.gray['870']};
`;

const Nickname = styled(Text)`
  color: ${theme.color.black['900']};

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled(Text)`
  color: ${theme.color.gray['600']};
`;

export default DefaultUserProfile;
