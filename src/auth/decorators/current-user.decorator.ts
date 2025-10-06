import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersModel } from '../../users/entities/users.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UsersModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
