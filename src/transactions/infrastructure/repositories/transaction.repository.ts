import { and, count, eq, gte, lte } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PaginatedResponse } from '../../core/paginated-response';
import { TransactionResponse } from '../../core/transaction-response';
import { Transaction } from '../../core/transaction.entity';
import type { ListTransactionsQuery } from '../../core/list-transactions-query';
import { TransactionMapper } from '../mappers/transaction-mapper';
import { transactionModel, transactionSchema } from '../transaction.model';
import { Inject } from '@nestjs/common';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<TransactionResponse>;
  findMany(
    query: ListTransactionsQuery,
  ): Promise<PaginatedResponse<TransactionResponse>>;
}

export class TransactionRepositoryImpl implements ITransactionRepository {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: PostgresJsDatabase<typeof transactionSchema>,
  ) {}

  async save(transactionEntity: Transaction): Promise<TransactionResponse> {
    const transaction = TransactionMapper.toInsert(transactionEntity);

    const [result] = await this.db
      .insert(transactionModel)
      .values(transaction)
      .returning();

    return TransactionMapper.toResponse(result);
  }

  async findMany(
    query: ListTransactionsQuery,
  ): Promise<PaginatedResponse<TransactionResponse>> {
    const { startDate, endDate, payerId, payeeId, page, limit } = query;
    const offset = (page - 1) * limit;

    const filters = and(
      startDate ? gte(transactionModel.createdAt, startDate) : undefined,
      endDate ? lte(transactionModel.createdAt, endDate) : undefined,
      payerId ? eq(transactionModel.payerId, payerId) : undefined,
      payeeId ? eq(transactionModel.payeeId, payeeId) : undefined,
    );

    const [rows, [{ value: total }]] = await Promise.all([
      this.db
        .select()
        .from(transactionModel)
        .where(filters)
        .limit(limit)
        .offset(offset),
      this.db.select({ value: count() }).from(transactionModel).where(filters),
    ]);

    const items = rows.map((row) => TransactionMapper.toResponse(row));

    return PaginatedResponse.create(items, Number(total), page, limit);
  }
}
