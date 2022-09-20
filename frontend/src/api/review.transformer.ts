import {
  GetReviewFormAnswerResponse,
  GetReviewFormResponse,
  GetReviewAnswerResponse,
  ReviewForm,
  ReviewAnswer,
  ReviewFormAnswerList,
  GetReviewPublicAnswerResponse,
  ReviewPublicAnswerList,
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

export const transformPublicAnswer = (
  data: GetReviewPublicAnswerResponse,
): ReviewPublicAnswerList => {
  const { numberOfReviews, reviews } = data;

  const transformReviews = reviews.map((review) => {
    const { id, reviewFormCode, contents, creator, isCreator, updatedAt, likes } = review;

    return {
      id,
      reviewFormCode,
      questions: contents.map((content) => ({
        id: content.question.id,
        value: content.question.value,
        description: content.question.description,
        answer: content.answer,
      })),
      likes,
      info: {
        creator,
        isSelf: isCreator,
        updateDate: getElapsedTimeText(updatedAt),
      },
    };
  });

  return { numberOfReviews, reviews: transformReviews };
};
