import { Transaction } from '../../core/transaction.entity';

export interface SendTransactionUseCase {
  execute(transaction: Transaction): Promise<void>;
}
