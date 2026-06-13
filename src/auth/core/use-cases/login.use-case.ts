import { LoginResponse } from '../entities/login-response.entity';

export interface LoginUseCase {
  execute(email: string, password: string): Promise<LoginResponse>;
}
