import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsersModel } from '../../users/entities/users.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UsersModel => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UsersModel }>();
    return request.user;
  },
);
