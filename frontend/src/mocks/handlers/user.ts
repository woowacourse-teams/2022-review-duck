import { rest } from 'msw';

import { DUMMY_USER } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';
import { API_URI } from 'service/@shared/constants';

const userHandlers = [
  rest.get(reviewduckAPI(API_URI.USER.GET_REVIEW_FORMS), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_USER.GET_REVIEW_FORMS)),
  ),
  rest.get(reviewduckAPI(API_URI.USER.GET_REVIEW_ANSWERS), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_USER.GET_REVIEW_ANSWERS)),
  ),
];

console.log(
  reviewduckAPI(API_URI.USER.GET_REVIEW_FORMS),
  reviewduckAPI(API_URI.USER.GET_REVIEW_ANSWERS),
);

export default userHandlers;
