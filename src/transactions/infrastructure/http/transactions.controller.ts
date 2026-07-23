import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import type { SendTransactionUseCase } from '../../aplication/use-cases/send-transaction.use-case';
import type { ListTransactionsUseCase } from '../../aplication/use-cases/list-transactions.use-case';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';
import { ListTransactionsDto } from '../dtos/ListTransactionsDto';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/users/core/user-role.enum';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject('SendTransactionUseCase')
    private readonly sendTransactionUseCase: SendTransactionUseCase,
    @Inject('ListTransactionsUseCase')
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
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

  @Roles(UserRole.CUSTOMER)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: ListTransactionsDto) {
    const result = await this.listTransactionsUseCase.execute(query);
    return {
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      data: result,
    };
  }
}
