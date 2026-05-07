import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TransactionResponse } from '../../core/transaction-response';
import { Transaction } from '../../core/transaction.entity';
import { TransactionMapper } from '../mappers/transaction-mapper';
import { transactionModel, transactionSchema } from '../transaction.model';
import { Inject } from '@nestjs/common';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<TransactionResponse>;
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
}
