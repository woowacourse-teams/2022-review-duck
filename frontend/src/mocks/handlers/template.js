import { rest } from 'msw';

import { reviewduckAPI } from 'mocks/hosts';

const dummyTemplate = [
  {
    templateId: 0,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
  {
    templateId: 1,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
  {
    templateId: 2,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
  {
    templateId: 3,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
];

const templateHandlers = [
  rest.get(reviewduckAPI('/api/templates'), (req, res, ctx) =>
    res(ctx.status(200), ctx.json(dummyTemplate)),
  ),
];

export default templateHandlers;
