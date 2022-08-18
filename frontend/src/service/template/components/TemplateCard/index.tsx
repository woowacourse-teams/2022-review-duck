import { useNavigate } from 'react-router-dom';

import cn from 'classnames';

import { Template } from 'service/@shared/types';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Icon, Text } from 'common/components';

import TagLabel from 'common/components/TagLabel';

import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import styles from './styles.module.scss';

import { PAGE_LIST } from 'service/@shared/constants';

interface Props {
  className?: string;
  template: Template;
}

function TemplateCard({ className, template }: Props) {
  const navigate = useNavigate();

  const handleMoveToTemplate = (templateId: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`);
  };

  return (
    <div
      className={cn(className, styles.container)}
      onClick={handleMoveToTemplate(template.info.id)}
    >
      <TagLabel>
        <>
          <Icon code="download" />
          <span>{`${template.info.usedCount}회`}</span>
        </>
      </TagLabel>
      <Text className={styles.title} size={20}>
        {template.info.title}
      </Text>
      <div className={styles.infoContainer}>
        <div className={styles.info}>
          <Icon className={styles.icon} code="schedule" />
          <span className={styles.text}>{getElapsedTimeText(template.info.updatedAt)}</span>
        </div>
      </div>
      <Text className={styles.description} size={14}>
        {template.info.description}
      </Text>
      <hr className={styles.line} />
      <SmallProfileCard
        profileUrl={template.creator.profileUrl}
        primaryText={template.creator.nickname}
        secondaryText={template.creator.socialNickname || ''}
      />
    </div>
  );
}

export default TemplateCard;
