import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserResponse } from 'src/users/core/user-response';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserResponse;
  },
);
