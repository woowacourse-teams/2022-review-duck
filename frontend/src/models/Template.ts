import Creator, { ResponseCreator } from './Creator';
import Question, { ResponseQuestion } from './Question';

interface ResponseTemplate {
  info: {
    id: number;
    title: string;
    description: string;
    updateAt: number;
    usedCount: number;
  };
  questions: ResponseQuestion[];
  creator: ResponseCreator;
  isCreator: boolean;
}

class Template {
  id: number;
  title: string;
  description: string;
  usedCount: number;
  updateTime: number;
  isEditable: boolean;

  questions: Question[];
  creator: Creator;

  constructor(responseData: ResponseTemplate) {
    this.id = responseData.info.id;

    this.title = responseData.info.title;
    this.description = responseData.info.description;

    this.usedCount = responseData.info.usedCount;
    this.updateTime = responseData.info.updateAt;
    this.isEditable = responseData.isCreator;

    this.questions = responseData.questions.map((question) => new Question(question));
    this.creator = new Creator(responseData.creator);
  }
}

export default Template;
