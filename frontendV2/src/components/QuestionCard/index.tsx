import cn from 'classnames';

import { FlexContainer } from 'common/components';
import Text from 'common/components/Text';

import styles from './styles.module.scss';

interface QuestionCardProps {
  className?: string;
  numbering: number;
  type: 'text';
  title: string;
  description: string;
}

/*
  TODO:
  type에 따른 질문 타입 텍스트 처리해주기
*/

function QuestionCard({ className, numbering, type, title, description }: QuestionCardProps) {
  return (
    <FlexContainer className={cn(className, styles.container)} direction="column">
      <FlexContainer className={styles.header} direction="row">
        <Text className={styles.numbering} size={18} weight="bold">
          Q{numbering}
        </Text>

        <Text className={styles.type} size={12} weight="lighter">
          단답형 질문
        </Text>
      </FlexContainer>

      <hr className={styles.line} />

      <Text className={styles.title} size={20} weight="bold">
        {title}
      </Text>
      {description && (
        <Text className={styles.description} size={14} weight="lighter">
          {description}
        </Text>
      )}
    </FlexContainer>
  );
}

QuestionCard.defaultProps = {
  type: 'text',
  description: '',
};

export default QuestionCard;
