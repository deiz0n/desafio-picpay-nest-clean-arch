import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import type { SendTransactionUseCase } from '../../aplication/use-cases/send-transaction.use-case';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/users/core/user-role.enum';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject('SendTransactionUseCase')
    private readonly sendTransactionUseCase: SendTransactionUseCase,
  ) {}

  @Roles(UserRole.CUSTOMER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateTransactionDto) {
    const result = await this.sendTransactionUseCase.execute(createDto);
    return {
      status: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      data: result,
    };
  }
}
