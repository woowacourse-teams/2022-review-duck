const PAGE_LIST = {
  HOME: '/',
  REVIEW_FORM: '/review-form',
  REVIEW: '/review',
  REVIEW_JOIN: '/review/join',
  REVIEW_OVERVIEW: '/overview',
  AUTHORIZE: '/authorize',
  MY_PAGE: '/mypage',
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

    GET_MY_REVIEWS: 'getMyReviews',
    GET_MY_REVIEW_FORMS: 'getMyReviewForms',
  },
};

const GITHUB_OAUTH_ERROR = {
  APPLICATION_SUSPENDED: 'application_suspended',
  ACCESS_DENIED: 'access_denied',
  REDIRECT_URI_MISMATCH: 'redirect_uri_mismatch',
};

const ACCESS_PERMISSION = {
  LOGOUT_USER: false,
  LOGIN_USER: true,
};

const ACCESS_TOKEN_EXPIRE_TIME = 60 * 10 * 1000;

const ACCESS_TOKEN_REFRESH_TIME = ACCESS_TOKEN_EXPIRE_TIME - 60 * 2 * 1000;

const PERMISSION_VALID_TIME = 60 * 1000;

const TAB = {
  MY_REVIEWS: 'my-reviews',
  MY_REVIEW_FORMS: 'my-review-forms',
};

export {
  PAGE_LIST,
  QUERY_KEY,
  GITHUB_OAUTH_ERROR,
  ACCESS_PERMISSION,
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  TAB,
  PERMISSION_VALID_TIME,
};
