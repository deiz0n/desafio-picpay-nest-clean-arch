import { UserNotFoundException } from 'src/users/core/errors/UserNotFoundException';
import { GetUserByIdUseCase } from 'src/users/core/use-cases/get-user-by-id.use-case';
import { UserResponse } from 'src/users/core/user-response';
import { IUserRepository } from 'src/users/infrastructure/repositories/users.repository';

export class GetUserByIdService implements GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundException('User not found');

    return user;
  }
}
