const PAGE_LIST = {
  HOME: '/',
  REVIEW_FORM: '/review/form',
  REVIEW: '/review',
  REVIEW_OVERVIEW: '/overview',
  AUTHORIZE: '/authorize',
  LOGOUT: '/logout',
  TEMPLATE_LIST: '/template/list',
  TEMPLATE_DETAIL: '/template/view',
  TEMPLATE_FORM: '/template/editor',
  USER_PROFILE: '/profile',
  TIMELINE: '/timeline',
};

const MODAL_LIST = {
  REVIEW_START: 'ModalReviewStart',
  REVIEW_JOIN: 'ModalReviewJoin',

  PROFILE_EDIT: 'ModalProfileEdit',
};

const API_REQUEST_TIMEOUT = 5000;

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
    GET_REVIEW_PUBLIC_ANSWER: 'getReviewPublicAnswer',

    GET_USER_REVIEWS: 'getMyReviews',
    GET_USER_REVIEW_FORMS: 'getMyReviewForms',
    GET_USER_TEMPLATES: 'getUserTemplates',

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

const FILTER = {
  USER_PROFILE_TAB: {
    REVIEWS: 'reviews',
    REVIEW_FORMS: 'review-forms',
    TEMPLATES: 'templates',
  },
  TEMPLATE_TAB: {
    TREND: 'trend',
    LATEST: 'latest',
  } as const,
  TIMELINE_TAB: {
    TREND: 'trend',
    LATEST: 'latest',
  },
  DISPLAY_MODE: {
    LIST: 'list',
    SHEET: 'sheet',
  },
};

const REVIEW_FORM_TITLE_LENGTH = 100;

const REVIEW_FORM_CODE_LENGTH = 8;

const REGEX = {
  REVIEW_FORM_CODE: `^[a-zA-Z0-9]{${REVIEW_FORM_CODE_LENGTH}}$`,
  NICKNAME: '^[a-zA-Z가-힣ㄱ-ㅎ0-9]{2,10}$',
};

const PAGE_OPTION = {
  REVIEW_BUTTON_LENGTH: 5,
  REVIEW_ITEM_SIZE: 5,
  TEMPLATE_ITEM_SIZE: 16,
  TEMPLATE_TREND_ITEM_SIZE: 10,
  TEMPLATE_BUTTON_LENGTH: 10,
  USER_TEMPLATE_SIZE: 5,
};

const API_URI = {
  AUTH: {
    GET_ACCESS_TOKEN: '/api/login/refresh',
    GET_USER_PROFILE: '/api/members/me',
  },
  REVIEW: {
    GET_FORM: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,
    GET_ANSWER: (reviewId: numberString) => `/api/reviews/${reviewId}`,
    GET_FORM_ANSWER: (reviewFormCode: string, display: string, page?: string, size?: number) =>
      `/api/review-forms/${reviewFormCode}/reviews?displayType=${display}&page=${page}&size=${size}`,
    GET_PUBLIC_ANSWER: '/api/reviews/public',

    CREATE_FORM: '/api/review-forms',
    CREATE_FORM_BY_TEMPLATE: (templateId: numberString) =>
      `/api/templates/${templateId}/review-forms/edited`,
    CREATE_ANSWER: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,

    UPDATE_FORM: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,
    UPDATE_ANSWER: (reviewId: numberString) => `/api/reviews/${reviewId}`,

    DELETE_FORM: (reviewFormCode: string) => `/api/review-forms/${reviewFormCode}`,
    DELETE_ANSWER: (reviewId: numberString) => `/api/reviews/${reviewId}`,
  },
  USER: {
    GET_REVIEW_ANSWERS: '/api/reviews',
    GET_REVIEW_FORMS: '/api/review-forms',
    GET_TEMPLATES: (socialId: numberString) => `/api/templates?member=${socialId}`,
    GET_PROFILE: (socialId: numberString) => `/api/members/${socialId}`,
    UPDATE_PROFILE: '/api/members/me',
  },
  TEMPLATE: {
    GET_TEMPLATES: '/api/templates/all',
    GET_TEMPLATE: (templateId: numberString) => `/api/templates/${templateId}`,

    CREATE_FORM: (templateId: numberString) => `/api/templates/${templateId}/review-forms`,
    CREATE_TEMPLATE: '/api/templates',

    UPDATE_TEMPLATE: (templateId: numberString) => `/api/templates/${templateId}`,

    DELETE_TEMPLATE: (templateId: numberString) => `/api/templates/${templateId}`,
  },
};

export {
  API_URI,
  API_REQUEST_TIMEOUT,
  PAGE_LIST,
  MODAL_LIST,
  QUERY_KEY,
  GITHUB_OAUTH_LOGIN_URL,
  GITHUB_PROFILE_URL,
  GITHUB_OAUTH_ERROR,
  ACCESS_PERMISSION,
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  FILTER,
  PERMISSION_VALID_TIME,
  REVIEW_FORM_TITLE_LENGTH,
  REVIEW_FORM_CODE_LENGTH,
  REGEX,
  PAGE_OPTION,
};
