import { Inject } from '@nestjs/common';
import { PaginatedResponse } from '../../core/paginated-response';
import { TransactionResponse } from '../../core/transaction-response';
import type { ListTransactionsQuery } from '../../core/list-transactions-query';
import type { ListTransactionsUseCase } from '../use-cases/list-transactions.use-case';
import type { ITransactionRepository } from '../../infrastructure/repositories/transaction.repository';

export class ListTransactionsService implements ListTransactionsUseCase {
  constructor(
    @Inject('TRANSACTION_REPOSITORY_TOKEN')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    query: ListTransactionsQuery,
  ): Promise<PaginatedResponse<TransactionResponse>> {
    return this.transactionRepository.findMany(query);
  }
}
