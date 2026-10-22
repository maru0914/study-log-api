import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../generated/prisma/client.js';

// Guard が req.user に入れた User を、引数として受け取れるようにする
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User =>
    ctx.switchToHttp().getRequest().user,
);
