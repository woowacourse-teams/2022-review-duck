interface RequiredRequests {
  isRequestPassed: boolean;
  missingRequestKeys: string[];
  message: string;
}

const validateRequiredRequests = (
  requestBody: Record<string, unknown>,
  requireKeys: string[],
): RequiredRequests => {
  const bodyKeys = Object.keys(requestBody);

  const missingRequestKeys: string[] = [];
  const isRequestPassed = requireKeys.every((requireKey) => {
    if (bodyKeys.includes(requireKey)) {
      return true;
    }

    missingRequestKeys.push(requireKey);
    return false;
  });

  return {
    isRequestPassed,
    missingRequestKeys,
    message: missingRequestKeys.join(', ') + ' 값이 요청되지 않았습니다.',
  };
};

export { validateRequiredRequests };
