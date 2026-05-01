import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/http/users.controller';
import { UserRepositoryImpl } from './infrastructure/repositories/users.repository';
import { CreateUserService } from './application/services/create-user.service';
import { GetAllUsersService } from './application/services/get-all-users.service';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: CreateUserService,
      useFactory: (userRepepository: UserRepositoryImpl) => {
        return new CreateUserService(userRepepository);
      },
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: GetAllUsersService,
      useFactory: (userRepository: UserRepositoryImpl) => {
        return new GetAllUsersService(userRepository);
      },
      inject: [USER_REPOSITORY_TOKEN],
    },
  ],
})
export class UsersModule {}
