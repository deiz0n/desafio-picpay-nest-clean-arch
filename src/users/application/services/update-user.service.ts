import { UpdateUserUseCase } from '../../core/use-cases/update-user.use-case';
import { UserResponse } from '../../core/user-response';
import { User } from '../../core/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/users.repository';
import { UserNotFoundException } from '../../core/errors/UserNotFoundException';
import { UserAlreadyExistsException } from '../../core/errors/UserAlreadyExistsException';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, user: User): Promise<UserResponse> {
    await this.checkIfUserExists(userId);
    await this.checkIfEmailAlreadyExists(userId, user);

    return this.userRepository.update(userId, user);
  }

  private async checkIfUserExists(userId: string): Promise<void> {
    const existing = await this.userRepository.findById(userId);
    if (!existing) throw new UserNotFoundException('User not found');
  }

  private async checkIfEmailAlreadyExists(
    userId: string,
    user: User,
  ): Promise<void> {
    const existingByEmail = await this.userRepository.findByEmail(user.email);
    if (existingByEmail && existingByEmail.id !== userId)
      throw new UserAlreadyExistsException('Email already in use');
  }
}
