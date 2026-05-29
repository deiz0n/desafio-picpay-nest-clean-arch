import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import type { CreateUserUseCase } from '../../core/use-cases/create-user.use-case';
import type { GetAllUsersUseCase } from '../../core/use-cases/get-all-users.use-case';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { PaginationDto } from '../dtos/PaginationDto';
import type { GetUserByIdUseCase } from 'src/users/core/use-cases/get-user-by-id.use-case';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('CreateUserUseCase')
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject('GetAllUsersUseCase')
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    @Inject('GetUserByIdUseCase')
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateUserDto) {
    const result = await this.createUserUseCase.execute(createDto);
    return {
      status: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() query: PaginationDto) {
    const result = await this.getAllUsersUseCase.execute(
      query.page,
      query.pageSize,
    );
    return {
      status: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.getUserByIdUseCase.execute(id);
    return {
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      data: result,
    };
  }
}
