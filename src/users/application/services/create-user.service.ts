import { Account } from '../../../accounts/core/accountEntity';
import { IAccountsRepository } from '../../../accounts/infrastructure/repositories/accounts.repository';
import { UserAlreadyExistsException } from '../../core/errors/UserAlreadyExistsException';
import { CreateUserUseCase } from '../../core/use-cases/create-user.use-case';
import { UserResponse } from '../../core/user-response';
import { User } from '../../core/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/users.repository';
import { IHasherProvider } from '../../../shared/application/providers/hasher.provider';

export class CreateUserService implements CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly accountsRepository: IAccountsRepository,
    private readonly hasher: IHasherProvider,
  ) {}

  async execute(data: User): Promise<UserResponse> {
    const hashedPassword = await this.hasher.hash(data.password);

    const user = new User(
      data.fullName,
      data.email,
      hashedPassword,
      data.role,
      data.cpf,
      data.cnpj,
    );

    await this.validateUser(user);
    const result = await this.userRepository.save(user);

    await this.createNewAccount(result.id);

    return result;
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

  private async createNewAccount(userId: string): Promise<void> {
    const account = new Account(10000, userId);
    await this.accountsRepository.save(account);
  }
}
