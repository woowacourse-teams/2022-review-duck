import { getElapsedTimeText } from 'service/@shared/utils';

import Creator, { ResponseCreator } from './Creator';
import Question, { ResponseQuestion } from './Question';

export interface ResponseTemplate {
  info: {
    id: number;
    title: string;
    description: string;
    updatedAt: number;
    usedCount: number;
  };
  questions: ResponseQuestion['question'][];
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

  questions: Question[] = [];
  creator: Creator;

  constructor(responseData: ResponseTemplate) {
    this.id = responseData.info.id;

    this.title = responseData.info.title;
    this.description = responseData.info.description;

    this.usedCount = responseData.info.usedCount;
    this.updateTime = responseData.info.updatedAt;
    this.isEditable = responseData.isCreator;

    this.questions =
      responseData.questions &&
      responseData.questions.map((question) => new Question({ question }));

    this.creator = new Creator(responseData.creator);
  }

  get elapsedTime(): ElapsedTime {
    return getElapsedTimeText(this.updateTime);
  }
}

export default Template;
