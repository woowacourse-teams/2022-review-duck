import { REVIEW_FORM_CODE_REGEX, REVIEW_FORM_TITLE_LENGTH } from 'constant';

import { Question } from '../../../types';

function validateReviewFormCode(reviewFormCode: string) {
  if (!new RegExp(REVIEW_FORM_CODE_REGEX, 'g').test(reviewFormCode)) {
    throw new Error('참여코드를 정확히 입력하여주세요.');
  }
}

function validateReviewForm(title: string, questions: Question[]) {
  if (title.trim().length <= 0) {
    throw new Error(`회고의 제목은 최소 1자 이상 입력해야 합니다.`);
  }

  if (title.length >= REVIEW_FORM_TITLE_LENGTH) {
    throw new Error(`회고의 제목은 최대 ${REVIEW_FORM_TITLE_LENGTH}자 이내로 입력해야 합니다.`);
  }

  if (questions.length <= 0) {
    throw new Error('회고의 질문은 최대 1개 이상 입력해야 합니다.');
  }
}

export { validateReviewFormCode, validateReviewForm };
