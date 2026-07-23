import { UserResponse } from '../user-response';

export interface GetUserByEmailUseCase {
  execute(email: string): Promise<UserResponse>;
}
