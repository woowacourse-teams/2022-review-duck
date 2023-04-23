import { REGEX } from 'constant';

function validateNickname(nickname: string) {
  if (!new RegExp(REGEX.NICKNAME, 'g').test(nickname)) {
    throw new Error('닉네임은 2 ~ 10자 영문,숫자,한글로 작성해주세요.');
  }
}

export { validateNickname };
