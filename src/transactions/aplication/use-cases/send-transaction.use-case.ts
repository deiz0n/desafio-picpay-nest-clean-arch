import { TransactionEntity } from '../../core/transaction.entity';

export interface SendTransactionUseCase {
  execute(transaction: TransactionEntity): Promise<void>;
}
