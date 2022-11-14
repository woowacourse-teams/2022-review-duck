import { dummyTemplates, dummyTemplate, dummyFormcode } from 'mocks/data';
import { reviewduckAPI } from 'mocks/hosts';
import { rest } from 'msw';

import { API_URI, FILTER } from 'constant';

const templateHandlers = [
  rest.get(reviewduckAPI(API_URI.TEMPLATE.GET_TEMPLATES), (req, res, ctx) => {
    if (req.url.searchParams.get('filter') === FILTER.TEMPLATE_TAB.TREND) {
      const copyTemplates = [...dummyTemplates.templates];
      const sortedTemplates = copyTemplates.sort(
        (first, second) => second.info.usedCount - first.info.usedCount,
      );
      return res(ctx.status(200), ctx.json({ templates: sortedTemplates }));
    }
    return res(ctx.status(200), ctx.json(dummyTemplates));
  }),

  rest.get(
    reviewduckAPI(API_URI.TEMPLATE.GET_TEMPLATE(':templateId' as numberString)),
    (req, res, ctx) => res(ctx.status(200), ctx.json(dummyTemplate)),
  ),

  rest.post(
    reviewduckAPI(API_URI.TEMPLATE.CREATE_FORM(':templateId' as numberString)),
    (req, res, ctx) => res(ctx.status(201), ctx.json(dummyFormcode)),
  ),

  rest.put(
    reviewduckAPI(API_URI.TEMPLATE.UPDATE_TEMPLATE(':templateId' as numberString)),
    (req, res, ctx) => res(ctx.status(204)),
  ),

  rest.delete(
    reviewduckAPI(API_URI.TEMPLATE.DELETE_TEMPLATE(':templateId' as numberString)),
    (req, res, ctx) => res(ctx.status(204)),
  ),
];

export default templateHandlers;
