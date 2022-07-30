const PAGE_LIST = {
  HOME: '/',
  REVIEW_FORM: '/review-form',
  REVIEW: '/review',
  REVIEW_JOIN: '/review/join',
  REVIEW_OVERVIEW: '/overview',
  AUTHORIZE: '/authorize',
};

const QUERY_KEY = {
  DATA: {
    USER: 'user',

    REVIEW: 'review',
    REVIEW_FORM: 'review-form',
  },
  API: {
    GET_ACCESS_TOKEN: 'getRefreshedAccessToken',
    GET_USER_PROFILE: 'getUserProfile',

    GET_REVIEWS: 'getReviews',
    GET_REVIEW_FORM: 'getReviewForm',
  },
};

const GITHUB_OAUTH_ERROR = {
  APPLICATION_SUSPENDED: 'application_suspended',
  ACCESS_DENIED: 'access_denied',
  REDIRECT_URI_MISMATCH: 'redirect_uri_mismatch',
};

const ACCESS_PERMISSION = {
  NON_LOGIN: false,
};

const ACCESS_TOKEN_EXPIRE_TIME = 60 * 10 * 1000;

const ACCESS_TOKEN_REFRESH_TIME = ACCESS_TOKEN_EXPIRE_TIME - 60 * 2 * 1000;

const ACCESS_VALID_TIME = 60;

export {
  PAGE_LIST,
  QUERY_KEY,
  GITHUB_OAUTH_ERROR,
  ACCESS_PERMISSION,
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  ACCESS_VALID_TIME,
};
