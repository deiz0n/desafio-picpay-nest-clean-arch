import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserResponse } from 'src/users/core/user-response';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = UserResponse>(
    err: unknown,
    user: UserResponse | null | undefined,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return user as TUser;
  }
}
