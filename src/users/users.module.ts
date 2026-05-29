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

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

@Module({
  imports: [AccountsModule],
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
      ) => {
        return new CreateUserService(userRepepository, accountsRepository);
      },
      inject: [USER_REPOSITORY_TOKEN, ACCOUNT_REPOSITORY_TOKEN],
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
      provide: 'UpdateUserUseCase',
      useFactory: (userRepository: UserRepositoryImpl) => {
        return new UpdateUserService(userRepository);
      },
      inject: [USER_REPOSITORY_TOKEN],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UsersModule {}
