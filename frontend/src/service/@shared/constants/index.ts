const PAGE_LIST = {
  HOME: '/',
  REVIEW_FORM: '/review/form',
  REVIEW: '/review',
  REVIEW_OVERVIEW: '/overview',
  AUTHORIZE: '/authorize',
  MY_PAGE: '/mypage',
  LOGOUT: '/logout',
  TEMPLATE_LIST: '/template/list',
  TEMPLATE_DETAIL: '/template/view',
  TEMPLATE_FORM: '/template/review-form',
  USER_PROFILE: '/profile',
};

const MODAL_LIST = {
  REVIEW_START: 'ModalReviewStart',
  REVIEW_JOIN: 'ModalReviewJoin',
};

const QUERY_KEY = {
  DATA: {
    AUTH: 'auth',
    USER: 'user',

    REVIEW: 'review',
    REVIEW_FORM: 'review-form',

    TEMPLATE: 'template',
  },
  API: {
    GET_ACCESS_TOKEN: 'getRefreshedAccessToken',
    GET_AUTH_MY_PROFILE: 'getAuthMyProfile',
    GET_USER_PROFILE: 'getUserProfile',

    GET_REVIEWS: 'getReviews',
    GET_REVIEW: 'getReview',
    GET_REVIEW_FORM: 'getReviewForm',

    GET_MY_REVIEWS: 'getMyReviews',
    GET_MY_REVIEW_FORMS: 'getMyReviewForms',

    GET_TEMPLATES: 'getTemplates',
    GET_TEMPLATE: 'getTemplate',
  },
};

const GITHUB_OAUTH_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_KEY}`;

const GITHUB_PROFILE_URL = 'https://github.com/';

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

const USER_PROFILE_TAB = {
  REVIEWS: 'reviews',
  REVIEW_FORMS: 'review-forms',
};

const TEMPLATE_TAB = {
  TREND: 'trend',
  LATEST: 'latest',
};

const REVIEW_FORM_TITLE_LENGTH = 100;

const REVIEW_FORM_CODE_LENGTH = 8;

const REVIEW_FORM_CODE_REGEX = `(?=.*[A-Za-z])(?=.*[0-9])[a-zA-Z0-9]{${REVIEW_FORM_CODE_LENGTH}}$`;

const API_URI = {
  AUTH: {
    GET_ACCESS_TOKEN: '/api/login/refresh',
    GET_USER_PROFILE: '/api/members/me',
  },
  REVIEW: {
    GET_FORM: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,
    GET_ANSWER: (reviewId: numberString) => `/api/reviews/${reviewId}`,
    GET_FORM_ANSWER: (reviewFormCode: string, display: string) =>
      `/api/review-forms/${reviewFormCode}/reviews?displayType=${display}`,

    CREATE_FORM: '/api/review-forms',
    CREATE_ANSWER: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,

    UPDATE_FORM: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,
    UPDATE_ANSWER: (reviewId: numberString) => `/api/reviews/${reviewId}`,

    DELETE_FORM: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,
    DELETE_ANSWER: (reviewId: numberString) => `/api/reviews/${reviewId}`,
  },
  USER: {
    GET_REVIEW_ANSWERS: '/api/reviews',
    GET_REVIEW_FORMS: '/api/review-forms',
    GET_PROFILE: (socialId: number) => ` /api/members/${socialId}`,
  },
};

export {
  API_URI,
  PAGE_LIST,
  MODAL_LIST,
  QUERY_KEY,
  GITHUB_OAUTH_LOGIN_URL,
  GITHUB_PROFILE_URL,
  GITHUB_OAUTH_ERROR,
  ACCESS_PERMISSION,
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  USER_PROFILE_TAB,
  TEMPLATE_TAB,
  PERMISSION_VALID_TIME,
  REVIEW_FORM_TITLE_LENGTH,
  REVIEW_FORM_CODE_LENGTH,
  REVIEW_FORM_CODE_REGEX,
};
