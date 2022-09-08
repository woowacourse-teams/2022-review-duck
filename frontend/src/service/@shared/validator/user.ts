function validateNickname(nickname: string) {
  if (nickname.length < 2 || nickname.length > 10) {
    throw new Error('닉네임은 2 ~ 10자 이내로 작성해주세요.');
  }
}

export { validateNickname };
