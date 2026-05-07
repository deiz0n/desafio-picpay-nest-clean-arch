import { TransactionResponse } from '../../core/transaction-response';
import { Transaction } from '../../core/transaction.entity';
import { TransactionType } from '../transaction.model';

export class TransactionMapper {
  static toInsert(transaction: Transaction): TransactionType {
    return {
      payerId: transaction.payerId,
      payeeId: transaction.payeeId,
      amount: transaction.amount,
    };
  }

  static toResponse(type: TransactionType): TransactionResponse {
    return {
      id: type.id!,
      payerId: type.payeeId,
      payeeId: type.payeeId,
      amount: type.amount,
    };
  }
}
