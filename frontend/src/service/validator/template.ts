import { REGEX, RULE } from 'constant';

function validateSearch(search: string) {
  if (!new RegExp(REGEX.SEARCH, 'g').test(search)) {
    throw new Error(
      `템플릿 검색은 ${RULE.SEARCH_MIN_LENGTH} ~ ${RULE.SEARCH_MAX_LENGTH}자 이내로 입력해야 합니다.`,
    );
  }
}

export { validateSearch };
