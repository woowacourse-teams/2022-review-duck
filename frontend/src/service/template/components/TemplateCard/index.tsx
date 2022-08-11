import { Link } from 'react-router-dom';

import { Template } from 'service/@shared/types';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Icon, Text } from 'common/components';

import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import styles from './styles.module.scss';

import { PAGE_LIST } from 'service/@shared/constants';

function TemplateCard({
  templateId,
  templateTitle,
  templateDescription,
  creator,
  updatedAt,
  usedCount,
}: Template) {
  return (
    <Link to={`${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`}>
      <div className={styles.container}>
        <Text className={styles.title} size={20}>
          {templateTitle}
        </Text>
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <Icon className={styles.icon} code="schedule" />
            <span className={styles.text}>{getElapsedTimeText(updatedAt)}</span>
          </div>
          <div className={styles.info}>
            <Icon className={styles.icon} code="download_for_offline" />
            <span className={styles.text}>{`${usedCount}회`}</span>
          </div>
        </div>
        <Text className={styles.description} size={14}>
          {templateDescription}
        </Text>
        <hr className={styles.line} />
        <SmallProfileCard
          profileUrl={creator.profileUrl}
          primaryText={creator.nickname}
          secondaryText={creator.socialId || ''}
        />
      </div>
    </Link>
  );
}

export default TemplateCard;
