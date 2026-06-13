import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from 'src/auth/core/entities/login-response.entity';
import { Payload } from 'src/auth/core/entities/payload.entity';
import { UnauthorizedException } from 'src/auth/core/errors/UnauthorizedException';
import { IHasherProvider } from 'src/shared/application/providers/hasher.provider';
import { LoginUseCase } from '../../core/use-cases/login.use-case';
import { IUserRepository } from '../../../users/infrastructure/repositories/users.repository';
import { UserRole } from 'src/users/core/user-role.enum';
import { UserResponse } from 'src/users/core/user-response';

export class LoginService implements LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly hasher: IHasherProvider,
  ) {}

  async execute(email: string, pass: string): Promise<LoginResponse> {
    const user = await this.userRepository.findWithPasswordByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.hasher.compare(pass, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = new Payload(user.id, user.email, user.role);
    const accessToken = await this.jwtService.signAsync({ ...payload });
    const userRole = user.role! as UserRole;

    const userResponse: UserResponse = {
      id: user.id!,
      fullName: user.fullName,
      email: user.email,
      role: userRole,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };

    return new LoginResponse(userResponse, accessToken);
  }
}
