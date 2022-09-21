import {
  GetUserReviewAnswerResponse,
  UserArticleList,
  GetUserReviewFormsResponse,
  GetUserTemplatesResponse,
} from 'types';

export const transformUserReviews = (data: GetUserReviewAnswerResponse): UserArticleList => {
  const { numberOfReviews, isMine, reviews } = data;

  return {
    totalNumber: numberOfReviews,
    isMine: isMine,
    articleList: reviews.map((review) => ({
      id: review.id,
      reviewFormCode: review.reviewForm.code,
      title: review.reviewForm.title,
      contents: review.contents.map((content) => ({
        question: {
          id: content.question.id,
          value: content.question.value,
          description: content.question.description,
        },
        answer: {
          value: content.answer.value,
        },
      })),
    })),
  };
};

export const transformUserReviewForms = (data: GetUserReviewFormsResponse): UserArticleList => {
  const { numberOfReviewForms, isMine, reviewForms } = data;

  return {
    totalNumber: numberOfReviewForms,
    isMine: isMine,
    articleList: reviewForms.map((reviewForm) => ({
      reviewFormCode: reviewForm.code,
      title: reviewForm.title,
      contents: reviewForm.questions.map((question) => ({
        question: {
          id: question.id,
          value: question.value,
          description: question.description,
        },
      })),
    })),
  };
};

export const transformUserTemplates = (data: GetUserTemplatesResponse): UserArticleList => {
  const { numberOfTemplates, isMine, templates } = data;

  return {
    totalNumber: numberOfTemplates,
    isMine: isMine,
    articleList: templates.map((template) => ({
      id: template.info.id,
      title: template.info.title,
      contents: template.questions.map((question) => ({
        question: {
          id: question.id,
          value: question.value,
          description: question.description,
        },
      })),
    })),
  };
};
