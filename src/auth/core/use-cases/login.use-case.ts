import { Token } from '../entities/token.entity';

export interface LoginUseCase {
  execute(email: string, password: string): Promise<Token>;
}
