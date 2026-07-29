import { UserResponse } from 'src/users/core/user-response';

export class LoginResponse {
  constructor(
    public readonly user: UserResponse,
    public readonly accessToken: string,
  ) {}
}
