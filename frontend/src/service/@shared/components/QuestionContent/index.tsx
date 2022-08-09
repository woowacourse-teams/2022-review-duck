import PropTypes from 'prop-types';

import { Question } from 'service/@shared/types';

import { Text } from 'common/components';

import styles from './styles.module.scss';

function QuestionContent({ questions }: Record<'questions', Question[]>) {
  return (
    <div className={styles.answerContainer}>
      {questions.map((question: Question, index: number) => (
        <div className={styles.answer} key={index}>
          <h5>{`${index + 1}. ${question.questionValue}`}</h5>

          {question.questionDescription && (
            <Text size={12} weight="lighter">
              {question.questionDescription}
            </Text>
          )}

          {question.answerValue && (
            <div className={styles.answerContent}>{question.answerValue}</div>
          )}
        </div>
      ))}
    </div>
  );
}

QuestionContent.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      questionValue: PropTypes.string.isRequired,
      answerValue: PropTypes.string,
      questionDescription: PropTypes.string,
    }),
  ).isRequired,
};

QuestionContent.defaultProps = {
  questions: [
    {
      questionValue: '',
    },
  ],
};

export default QuestionContent;
