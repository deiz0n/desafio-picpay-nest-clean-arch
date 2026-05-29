import { UserResponse } from '../user-response';

export interface GetUserByIdUseCase {
  execute(userId: string): Promise<UserResponse>;
}
