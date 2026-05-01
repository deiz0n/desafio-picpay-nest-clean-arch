import { GetAllUsersUseCase } from '../../core/use-cases/get-all-users.use-case';
import { UserResponse } from '../../core/user-response';
import { IUserRepository } from '../../infrastructure/repositories/users.repository';

export class GetAllUsersService implements GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(page?: number, pageSize?: number): Promise<UserResponse[]> {
    return this.userRepository.findAll(page, pageSize);
  }
}
