import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/http/auth.controller';
import { LoginService } from './application/services/login.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { UsersModule, USER_REPOSITORY_TOKEN } from '../users/users.module';
import { UserRepositoryImpl } from '../users/infrastructure/repositories/users.repository';
import { SharedModule, HASHER_PROVIDER_TOKEN } from '../shared/shared.module';
import { IHasherProvider } from '../shared/application/providers/hasher.provider';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secretKey123',
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'LoginUseCase',
      useFactory: (
        userRepository: UserRepositoryImpl,
        jwtService: JwtService,
        hasher: IHasherProvider,
      ) => {
        return new LoginService(userRepository, jwtService, hasher);
      },
      inject: [USER_REPOSITORY_TOKEN, JwtService, HASHER_PROVIDER_TOKEN],
    },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
