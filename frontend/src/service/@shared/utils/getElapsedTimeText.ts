function getElapsedTimeText(timestamp: number) {
  const elapsed = Math.round((Date.now() - timestamp) / 1000);

  if (elapsed < 0) return '0초 전';

  const timeUnitRange = [
    { limit: 60, text: '초 전' },
    { limit: 60 * 60, text: '분 전' },
    { limit: 60 * 60 * 24, text: '시간 전' },
    { limit: 60 * 60 * 24 * 7, text: '일 전' },
  ];

  const maxTimeLimit = timeUnitRange[timeUnitRange.length - 1].limit;

  if (elapsed > maxTimeLimit) {
    const elapsedDate = new Date(timestamp);

    return `${elapsedDate.getFullYear()}년 ${elapsedDate.getMonth()}월 ${elapsedDate.getDate()}일`;
  }

  const timeText = timeUnitRange.reduce((previous, { limit, text }, index) => {
    if (elapsed > limit || previous) {
      return previous;
    }

    const unit = index > 0 ? timeUnitRange[index - 1].limit : 1;

    return `${Math.round(elapsed / unit)}${text}`;
  }, '');

  return timeText;
}

export default getElapsedTimeText;
