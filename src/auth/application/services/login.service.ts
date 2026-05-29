import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/auth/core/entities/token.entity';
import { Payload } from 'src/auth/core/entities/payload.entity';
import { UnauthorizedException } from 'src/auth/core/errors/UnauthorizedException';
import { IHasherProvider } from 'src/shared/application/providers/hasher.provider';
import { LoginUseCase } from '../../core/use-cases/login.use-case';
import { IUserRepository } from '../../../users/infrastructure/repositories/users.repository';

export class LoginService implements LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly hasher: IHasherProvider,
  ) {}

  async execute(email: string, pass: string): Promise<Token> {
    const user = await this.userRepository.findWithPasswordByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.hasher.compare(pass, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = new Payload(user.id, user.email, user.role);

    return new Token(await this.jwtService.signAsync({ ...payload }));
  }
}
