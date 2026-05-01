import { UserAlreadyExistsException } from '../../core/errors/UserAlreadyExistsException';
import { CreateUserUseCase } from '../../core/use-cases/create-user.use-case';
import { UserResponse } from '../../core/user-response';
import { User } from '../../core/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/users.repository';

export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: User): Promise<UserResponse> {
    const user = new User(
      data.fullName,
      data.email,
      data.password,
      data.role,
      data.cpf,
      data.cnpj,
    );

    await this.validateUser(user);
    return this.userRepository.save(user);
  }

  private async validateUser(user: User) {
    const existsByEmail = await this.userRepository.findByEmail(user.email);
    if (existsByEmail)
      throw new UserAlreadyExistsException('User already exists');

    if (user.cpf) {
      const existsByCpf = await this.userRepository.findByCpf(user.cpf);
      if (existsByCpf)
        throw new UserAlreadyExistsException('User already exists');
    }

    if (user.cnpj) {
      const existsByCnpj = await this.userRepository.findByCnpj(user.cnpj);
      if (existsByCnpj)
        throw new UserAlreadyExistsException('User already exists');
    }
  }
}
