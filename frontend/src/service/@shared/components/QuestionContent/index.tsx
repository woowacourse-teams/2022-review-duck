import PropTypes from 'prop-types';
import { Question } from 'types';

import { Text } from 'common/components';

import styles from './styles.module.scss';

function QuestionContent({ questions }: Record<'questions', Question[]>) {
  return <></>;
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
