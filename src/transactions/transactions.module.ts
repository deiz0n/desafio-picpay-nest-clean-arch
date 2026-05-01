import { Module } from '@nestjs/common';
import { TransactionsController } from './infrastructure/http/transactions.controller';

@Module({
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsModule {}
