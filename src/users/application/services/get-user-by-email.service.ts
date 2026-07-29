import { UserNotFoundException } from 'src/users/core/errors/UserNotFoundException';
import { GetUserByEmailUseCase } from 'src/users/core/use-cases/get-user-by-email.use-case';
import { UserResponse } from 'src/users/core/user-response';
import { IUserRepository } from 'src/users/infrastructure/repositories/users.repository';

export class GetUserByEmailService implements GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundException('User not found');

    return user;
  }
}
