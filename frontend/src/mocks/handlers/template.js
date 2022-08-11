import { rest } from 'msw';

import { dummyTemplates } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';

const templateHandlers = [
  rest.get(reviewduckAPI('/api/templates'), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(dummyTemplates)),
  ),
];

export default templateHandlers;
