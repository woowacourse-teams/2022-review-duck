import { Question } from 'types';

class QuestionsModel {
  static trim(questions: Question[]) {
    return questions.filter((data) => data.value !== '');
  }

  static inputCount(questions: Question[]) {
    return this.trim(questions).length;
  }
}

export default QuestionsModel;
