import { DUMMY_USER } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';
import { rest } from 'msw';

import { API_URI } from 'constant';

const userHandlers = [
  rest.get(reviewduckAPI(API_URI.USER.GET_REVIEW_FORMS), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_USER.GET_REVIEW_FORMS)),
  ),

  rest.get(reviewduckAPI(API_URI.USER.GET_REVIEW_ANSWERS), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_USER.GET_REVIEW_ANSWERS)),
  ),

  rest.get(
    reviewduckAPI(API_URI.USER.GET_PROFILE(':socialId' as numberString)),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_USER.GET_USER_PROFILE));
    },
  ),
];

export default userHandlers;
