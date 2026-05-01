import { UserResponse } from '../user-response';

export interface GetAllUsersUseCase {
  execute(page?: number, pageSize?: number): Promise<UserResponse[]>;
}
