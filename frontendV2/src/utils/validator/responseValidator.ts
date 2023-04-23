type ValidateFunction<T = any> = (value: T) => boolean;

function required<T>(value: T, validateFn: ValidateFunction) {
  if (!validateFn(value)) {
    console.error(
      `API 응답 값이 올바르지 않습니다.\n- required - 값: ${value}, 검증: ${validateFn}`,
    );
    throw new Error('서버와 통신 중 오류가 발생하였습니다.');
  }

  return value;
}

function optional<T, K = undefined | T>(value: T, validateFn: ValidateFunction, defaultValue?: K) {
  return validateFn(value) ? value : (defaultValue as K extends T ? T : K);
}

export { required, optional };
