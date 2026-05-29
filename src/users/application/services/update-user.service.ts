import { UpdateUserUseCase } from '../../core/use-cases/update-user.use-case';
import { UserResponse } from '../../core/user-response';
import { User } from '../../core/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/users.repository';
import { UserNotFoundException } from '../../core/errors/UserNotFoundException';
import { UserAlreadyExistsException } from '../../core/errors/UserAlreadyExistsException';
import { IHasherProvider } from '../../../shared/application/providers/hasher.provider';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasherProvider,
  ) {}

  async execute(userId: string, user: User): Promise<UserResponse> {
    await this.checkIfUserExists(userId);
    await this.checkIfEmailAlreadyExists(userId, user);

    let updatedUser = user;
    if (user.password) {
      const hashedPassword = await this.hasher.hash(user.password);
      updatedUser = new User(
        user.fullName,
        user.email,
        hashedPassword,
        user.role,
        user.cpf,
        user.cnpj,
      );
    }

    return this.userRepository.update(userId, updatedUser);
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
