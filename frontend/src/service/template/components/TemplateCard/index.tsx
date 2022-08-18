import cn from 'classnames';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Icon, Text } from 'common/components';

import TagLabel from 'common/components/TagLabel';

import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import styles from './styles.module.scss';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

function Container({ className, children }: ContainerProps) {
  return <div className={cn(className, styles.container)}>{children}</div>;
}

interface TagProps {
  className?: string;
  usedCount: number;
}

function Tag({ className, usedCount }: TagProps) {
  return (
    <TagLabel className={className}>
      <>
        <Icon code="download" />
        <span>{`${usedCount}회`}</span>
      </>
    </TagLabel>
  );
}

interface TitleProps {
  className?: string;
  title: string;
}

function Title({ className, title }: TitleProps) {
  return (
    <Text className={cn(className, styles.title)} size={20}>
      {title}
    </Text>
  );
}

interface UpdatedAtProps {
  className?: string;
  updatedAt: number;
}

function UpdatedAt({ className, updatedAt }: UpdatedAtProps) {
  return (
    <div className={cn(className, styles.infoContainer)}>
      <div className={styles.info}>
        <Icon className={styles.icon} code="schedule" />
        <span className={styles.text}>{getElapsedTimeText(updatedAt)}</span>
      </div>
    </div>
  );
}

interface DescriptionProps {
  className?: string;
  description: string;
}

function Description({ className, description }: DescriptionProps) {
  return (
    <Text className={cn(className, styles.description)} size={14}>
      {description}
    </Text>
  );
}

interface LineProps {
  className?: string;
}

function Line({ className }: LineProps) {
  return <hr className={cn(className, styles.line)} />;
}

interface ProfileProps {
  profileUrl: string;
  nickname: string;
  socialNickname: string;
}

function Profile({ profileUrl, nickname, socialNickname }: ProfileProps) {
  return (
    <SmallProfileCard
      profileUrl={profileUrl}
      primaryText={nickname}
      secondaryText={socialNickname || ''}
    />
  );
}

const TemplateCard = Object.assign(Container, {
  Tag,
  Title,
  UpdatedAt,
  Description,
  Line,
  Profile,
});

export default TemplateCard;
