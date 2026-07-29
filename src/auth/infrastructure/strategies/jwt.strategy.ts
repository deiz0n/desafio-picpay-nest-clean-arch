import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload } from 'src/auth/core/entities/payload.entity';
import { Request } from 'express';
import { USER_REPOSITORY_TOKEN } from 'src/users/users.module';
import type { IUserRepository } from 'src/users/infrastructure/repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: (req: Request): string | null => {
        const cookies = req.cookies as unknown as Record<string, unknown>;
        const token = cookies['access_token'];

        return typeof token === 'string' ? token : null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey123',
    });
  }

  async validate(payload: Payload) {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
