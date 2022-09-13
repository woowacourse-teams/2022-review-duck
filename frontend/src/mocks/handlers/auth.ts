import { API_URI } from 'constant';
import { rest } from 'msw';

import { DUMMY_AUTH } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';

const authHandlers = [
  rest.get(reviewduckAPI(API_URI.AUTH.GET_ACCESS_TOKEN), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_AUTH.GET_ACCESS_TOKEN)),
  ),

  rest.get(reviewduckAPI(API_URI.AUTH.GET_USER_PROFILE), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_AUTH.GET_USER_PROFILE)),
  ),
];

export default authHandlers;
