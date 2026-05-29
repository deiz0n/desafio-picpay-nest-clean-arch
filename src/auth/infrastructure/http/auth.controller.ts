import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { LoginDto } from './dtos/LoginDto';
import type { LoginUseCase } from '../../core/use-cases/login.use-case';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('LoginUseCase')
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto.email, loginDto.password);
  }
}
