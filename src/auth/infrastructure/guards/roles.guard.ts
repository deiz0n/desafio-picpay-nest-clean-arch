import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../users/core/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/users/core/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const user = context.switchToHttp().getRequest<User>();

    if (!user) throw new ForbiddenException('User not found in request');

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole)
      throw new ForbiddenException(
        'User does not have the required role to access this resource',
      );

    return true;
  }
}
