import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/http/users.controller';
import { UserRepositoryImpl } from './infrastructure/repositories/users.repository';
import { CreateUserService } from './application/services/create-user.service';
import { GetAllUsersService } from './application/services/get-all-users.service';
import {
  ACCOUNT_REPOSITORY_TOKEN,
  AccountsModule,
} from '../accounts/accounts.module';
import { AccountsRepositoryImpl } from '../accounts/infrastructure/repositories/accounts.repository';
import { UpdateUserService } from './application/services/update-user.service';
import { GetUserByIdService } from './application/services/get-user-by-id.service';
import { GetUserByEmailService } from './application/services/get-user-by-email.service';
import { SharedModule, HASHER_PROVIDER_TOKEN } from '../shared/shared.module';
import { IHasherProvider } from '../shared/application/providers/hasher.provider';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

@Module({
  imports: [AccountsModule, SharedModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'CreateUserUseCase',
      useFactory: (
        userRepepository: UserRepositoryImpl,
        accountsRepository: AccountsRepositoryImpl,
        hasher: IHasherProvider,
      ) => {
        return new CreateUserService(
          userRepepository,
          accountsRepository,
          hasher,
        );
      },
      inject: [
        USER_REPOSITORY_TOKEN,
        ACCOUNT_REPOSITORY_TOKEN,
        HASHER_PROVIDER_TOKEN,
      ],
    },
    {
      provide: 'GetAllUsersUseCase',
      useFactory: (userRepository: UserRepositoryImpl) => {
        return new GetAllUsersService(userRepository);
      },
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: 'GetUserByIdUseCase',
      useFactory: (userRepository: UserRepositoryImpl) => {
        return new GetUserByIdService(userRepository);
      },
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: 'GetUserByEmailUseCase',
      useFactory: (userRepository: UserRepositoryImpl) => {
        return new GetUserByEmailService(userRepository);
      },
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: 'UpdateUserUseCase',
      useFactory: (
        userRepository: UserRepositoryImpl,
        hasher: IHasherProvider,
      ) => {
        return new UpdateUserService(userRepository, hasher);
      },
      inject: [USER_REPOSITORY_TOKEN, HASHER_PROVIDER_TOKEN],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UsersModule {}
