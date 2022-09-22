function validateFilter(validTabNameArray: string[], currentTab: string) {
  if (validTabNameArray.findIndex((tab) => tab === currentTab) < 0) {
    throw new Error('찾을 수 없는 페이지입니다.');
  }
}

export { validateFilter };
