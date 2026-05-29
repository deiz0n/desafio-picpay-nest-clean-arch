import { UserResponse } from '../user-response';
import { User } from '../user.entity';

export interface UpdateUserUseCase {
  execute(userId: string, user: User): Promise<UserResponse>;
}
