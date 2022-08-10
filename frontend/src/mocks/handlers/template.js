import { rest } from 'msw';

import { dummyTemplates, dummyTemplate } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';

const templateHandlers = [
  rest.get(reviewduckAPI('/api/templates'), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(dummyTemplates)),
  ),

  rest.get(reviewduckAPI('/api/templates/:templateId'), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(dummyTemplate)),
  ),

  rest.post(reviewduckAPI('/api/templates/:templateId/review-forms'), (req, res, ctx) =>
    res(ctx.status(201), ctx.json(dummyFormcode)),
  ),

  rest.put(reviewduckAPI('/api/templates/:templateId'), (req, res, ctx) => res(ctx.status(204))),

  rest.delete(reviewduckAPI('/api/templates/:templateId'), (req, res, ctx) => res(ctx.status(204))),
];

export default templateHandlers;
