/**
 * @author 콤피 <compy.ryu@gmail.com>
 * @comment 예시를 위한 컨벤션 핸들러입니다. MSW 모킹이 어느정도 진행될 시 제거하여주세요.
 */
import { rest } from 'msw';

const conventionHandlers = [
  rest.post('./example', (req, res, ctx) => {
    const { userId, password } = req.body;

    return res(
      ctx.status(200),
      ctx.json({ accessToken: `msw_mocking_token_${userId}_${password}` }),
    );
  }),
];

export default conventionHandlers;
