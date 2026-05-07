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

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject('SendTransactionUseCase')
    private readonly sendTransactionUseCase: SendTransactionUseCase,
  ) {}

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
