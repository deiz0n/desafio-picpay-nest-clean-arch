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
      balance: type.balance!,
      userId: type.userId,
    };
  }
}
