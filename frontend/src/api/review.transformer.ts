import {
  GetReviewFormAnswerResponse,
  GetReviewFormResponse,
  GetReviewAnswerResponse,
  ReviewForm,
  ReviewAnswer,
  ReviewFormAnswerList,
} from 'types';

import { getElapsedTimeText } from 'service/@shared/utils';

export const transformForm = (data: GetReviewFormResponse): ReviewForm => {
  const { reviewFormTitle, questions, creator, isCreator, updatedAt } = data;

  return {
    title: reviewFormTitle,
    questions,
    info: {
      creator,
      isSelf: isCreator,
      updateDate: getElapsedTimeText(updatedAt),
    },
  };
};

export const transformAnswer = (data: GetReviewAnswerResponse): ReviewAnswer => {
  const { id, contents, creator, isCreator, updatedAt, isPrivate } = data;

  return {
    id: id,
    questions: contents.map((content) => ({
      id: content.question.id,
      value: content.question.value,
      description: content.question.description,
      answer: content.answer,
    })),
    info: {
      creator,
      isSelf: isCreator,
      updateDate: getElapsedTimeText(updatedAt),
      isPrivate,
    },
  };
};

export const transformFormAnswer = (data: GetReviewFormAnswerResponse): ReviewFormAnswerList => {
  return data.map((review) => {
    const { id, contents, creator, isCreator, updatedAt } = review;

    return {
      id,
      questions: contents.map((content) => ({
        id: content.question.id,
        value: content.question.value,
        description: content.question.description,
        answer: content.answer,
      })),
      info: {
        creator,
        isSelf: isCreator,
        updateDate: getElapsedTimeText(updatedAt),
      },
    };
  });
};
