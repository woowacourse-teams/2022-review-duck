import { Question } from 'types';

import { Text } from 'common/components';

import styles from './styles.module.scss';

function QuestionContent({ questions }: Record<'questions', Question[]>) {
  return <></>;
}

QuestionContent.defaultProps = {
  questions: [
    {
      questionValue: '',
    },
  ],
};

export default QuestionContent;
