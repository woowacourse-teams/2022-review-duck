import { faClock, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { FlexContainer, Text, TagLabel } from 'common/components';
import SmallProfileCard from 'service/components/SmallProfileCard';

import styles from './styles.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Container({ className, children, ...args }: ContainerProps) {
  return (
    <FlexContainer className={cn(className, styles.container)} gap="small" {...args}>
      {children}
    </FlexContainer>
  );
}

interface TagProps {
  className?: string;
  usedCount: number;
}

function Tag({ className, usedCount }: TagProps) {
  return (
    <TagLabel className={className}>
      <FontAwesomeIcon icon={faDownload} />
      <span>{`${usedCount}회`}</span>
    </TagLabel>
  );
}

interface TitleProps {
  className?: string;
  children: string;
}

function Title({ className, children }: TitleProps) {
  return (
    <Text className={cn(className, styles.title)} size={20}>
      {children}
    </Text>
  );
}

interface UpdatedAtProps {
  className?: string;
  children: string;
}

function UpdatedAt({ className, children }: UpdatedAtProps) {
  return (
    <FlexContainer className={cn(className, styles.info)} direction="row" align="center">
      <FontAwesomeIcon className={styles.icon} icon={faClock} />
      <span className={styles.text}>{children}</span>
    </FlexContainer>
  );
}

interface DescriptionProps {
  className?: string;
  children: string;
}

function Description({ className, children }: DescriptionProps) {
  return (
    <Text className={cn(className, styles.description)} size={16}>
      {children}
    </Text>
  );
}

interface ProfileProps {
  profileUrl: string;
  nickname: string;
  socialNickname: string;
}

function Profile({ profileUrl, nickname, socialNickname }: ProfileProps) {
  return (
    <>
      <hr className={styles.line} />
      <SmallProfileCard
        profileUrl={profileUrl}
        primaryText={nickname}
        secondaryText={socialNickname}
      />
    </>
  );
}

const TemplateCard = Object.assign(Container, {
  Tag,
  Title,
  UpdatedAt,
  Description,
  Profile,
});

export default TemplateCard;
