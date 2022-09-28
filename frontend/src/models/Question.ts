import Answer from './Answer';

export interface ResponseQuestion {
  question: {
    id: number;
    value: string;
    description: string;
  };
  answer?: {
    id: number;
    value: string;
    description: string;
  };
}

class Question {
  id: number;
  value: string;
  description: string;
  answer: Answer;

  constructor(responseData: ResponseQuestion) {
    this.id = responseData.question.id;
    this.value = responseData.question.value;
    this.description = responseData.question.description;
    this.answer = new Answer(responseData.answer);
  }
}

export default Question;
