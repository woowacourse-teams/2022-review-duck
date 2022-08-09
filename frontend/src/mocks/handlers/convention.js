/**
 * @author 콤피 <compy.ryu@gmail.com>
 * @comment
 * 예시를 위한 컨벤션 핸들러입니다. 도메인 별로 모킹 목록을 나누어주세요.
 * 추후, MSW 모킹이 어느정도 진행될 시 제거하여주세요.
 */
import { rest } from 'msw';

import { reviewduckAPI } from 'mocks/hosts';

const conventionHandlers = [
  rest.post(reviewduckAPI('/example'), (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ title: '콤피입니더' })),
  ),
];

export default conventionHandlers;
