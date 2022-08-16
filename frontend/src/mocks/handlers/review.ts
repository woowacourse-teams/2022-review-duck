import { rest } from 'msw';

import { DUMMY_REVIEW } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';
import { API_URI } from 'service/@shared/constants';

const reviewHandlers = [
  rest.get(reviewduckAPI(API_URI.REVIEW.GET_FORM(':reviewFormCode')), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_REVIEW.GET_FORM)),
  ),

  rest.get(reviewduckAPI(API_URI.REVIEW.GET_ANSWER(':reviewId' as numberString)), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_REVIEW.GET_ANSWER)),
  ),

  rest.get(reviewduckAPI(API_URI.REVIEW.GET_FORM_ANSWER(':reviewFormCode')), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_REVIEW.GET_FORM_ANSWER)),
  ),

  rest.post(reviewduckAPI(API_URI.REVIEW.CREATE_FORM), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_REVIEW.CREATE_FORM)),
  ),

  rest.post(reviewduckAPI(API_URI.REVIEW.CREATE_ANSWER(':reviewFormCode')), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_REVIEW.CREATE_ANSWER)),
  ),

  rest.put(reviewduckAPI(API_URI.REVIEW.UPDATE_FORM(':reviewFormCode')), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(DUMMY_REVIEW.UPDATE_FORM)),
  ),

  rest.put(
    reviewduckAPI(API_URI.REVIEW.UPDATE_ANSWER(':reviewId' as numberString)),
    (req, res, ctx) => res(ctx.status(200), ctx.json(DUMMY_REVIEW.UPDATE_ANSWER)),
  ),

  rest.delete(reviewduckAPI(API_URI.REVIEW.DELETE_FORM(':reviewFormCode')), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(null)),
  ),

  rest.delete(
    reviewduckAPI(API_URI.REVIEW.DELETE_ANSWER(':reviewId' as numberString)),
    (req, res, ctx) => res(ctx.status(200), ctx.json(null)),
  ),
];

export default reviewHandlers;
