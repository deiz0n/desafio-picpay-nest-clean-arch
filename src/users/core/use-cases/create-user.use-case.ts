import { UserResponse } from '../user-response';
import { User } from '../user.entity';

export interface CreateUserUseCase {
  execute(user: User): Promise<UserResponse>;
}
