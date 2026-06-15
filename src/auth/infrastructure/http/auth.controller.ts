import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dtos/LoginDto';
import type { LoginUseCase } from '../../core/use-cases/login.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { UserResponse } from 'src/users/core/user-response';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('LoginUseCase')
    private readonly loginUseCase: LoginUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.loginUseCase.execute(
      loginDto.email,
      loginDto.password,
    );

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      status: HttpStatus.OK,
      data: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: UserResponse) {
    return {
      status: HttpStatus.OK,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });
  }
}
