import { Link } from 'react-router-dom';

import { Template } from 'service/@shared/types';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Icon, Text } from 'common/components';

import TagLabel from 'common/components/TagLabel';

import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import styles from './styles.module.scss';

import { PAGE_LIST } from 'service/@shared/constants';

function TemplateCard({ info, creator }: Template) {
  return (
    <Link to={`${PAGE_LIST.TEMPLATE_DETAIL}/${info.id}`}>
      <div className={styles.container}>
        <TagLabel>
          <>
            <Icon code="download" />
            <span>{`${info.usedCount}회`}</span>
          </>
        </TagLabel>
        <Text className={styles.title} size={20}>
          {info.title}
        </Text>
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <Icon className={styles.icon} code="schedule" />
            <span className={styles.text}>{getElapsedTimeText(info.updatedAt)}</span>
          </div>
        </div>
        <Text className={styles.description} size={14}>
          {info.description}
        </Text>
        <hr className={styles.line} />
        <SmallProfileCard
          profileUrl={creator.profileUrl}
          primaryText={creator.nickname}
          secondaryText={creator.socialNickname || ''}
        />
      </div>
    </Link>
  );
}

export default TemplateCard;
