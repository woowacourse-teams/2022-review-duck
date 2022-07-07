import cn from 'classnames';
import PropTypes from 'prop-types';
import Text from 'common/components/Text';
import styles from './styles.module.scss';

interface Props {
  numbering: number;
  type: 'text';
  title: string;
  description: string;
}

/*
  TODO:
  type에 따른 질문 타입 텍스트 처리해주기
*/

function QuestionCard({ numbering, type, title, description }: Props) {
  return (
    <section className={cn(styles.container, 'flex-container column')}>
      <div className={cn(styles.header, 'flex-container row')}>
        <Text className={cn(styles.numbering)} size={18} weight="bold">
          Q{numbering}
        </Text>

        <Text className={cn(styles.type)} size={12} weight="lighter">
          단답형 질문
        </Text>
      </div>

      <hr className={cn(styles.line)} />

      <Text className={cn(styles.title)} size={20} weight="bold">
        {title}
      </Text>
      {description && (
        <Text size={14} weight="lighter">
          {description}
        </Text>
      )}
    </section>
  );
}

QuestionCard.propTypes = {
  numbering: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['text']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

QuestionCard.defaultProps = {
  type: 'text',
  description: '',
};

export default QuestionCard;
