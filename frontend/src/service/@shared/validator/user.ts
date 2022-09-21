import { REGEX } from 'constant';

function validateNickname(nickname: string) {
  if (!new RegExp(REGEX.NICKNAME, 'g').test(nickname)) {
    throw new Error('닉네임은 2 ~ 10자 이내로 작성해주세요.');
  }
}

function validateTab(currentTab: string) {
  if (['reviews', 'review-forms', 'templates'].findIndex((tab) => tab === currentTab) < 0) {
    throw new Error('찾을 수 없는 페이지입니다.');
  }
}

export { validateNickname, validateTab };
