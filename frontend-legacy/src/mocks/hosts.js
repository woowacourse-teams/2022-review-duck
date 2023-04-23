function reviewduckAPI(path) {
  return `${process.env.API_URL}${path}`;
}

export { reviewduckAPI };
