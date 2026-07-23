import { PaginatedResponse } from '../../core/paginated-response';
import { TransactionResponse } from '../../core/transaction-response';
import type { ListTransactionsQuery } from '../../core/list-transactions-query';

export interface ListTransactionsUseCase {
  execute(
    query: ListTransactionsQuery,
  ): Promise<PaginatedResponse<TransactionResponse>>;
}
