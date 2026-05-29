import { AccountResponse } from '../../core/account-response';
import { Account } from '../../core/accountEntity';
import { AccountType } from '../accounts.model';

export class AccountMapper {
  static toInsert(account: Account): AccountType {
    return {
      balance: account.balance,
      userId: account.userId,
    };
  }

  static toResponse(type: AccountType): AccountResponse {
    return {
      id: type.id!,
      balance: Number((type.balance! / 100).toFixed(2)),
      userId: type.userId,
    };
  }
}
