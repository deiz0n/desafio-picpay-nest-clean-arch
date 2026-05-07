import { accountModel, AccountType } from '../accounts.model';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type {
  DrizzleTransaction,
  DrizzleDB,
} from '../../../drizzle/drizzle.types';
import { AccountResponse } from '../../core/account-response';
import { Account } from '../../core/accountEntity';
import { AccountMapper } from '../mappers/account-mapper';

export interface IAccountsRepository {
  findByUserId(userId: string): Promise<AccountResponse | null>;
  findByUserIdLock(
    userId: string,
    transaction?: DrizzleTransaction,
  ): Promise<AccountResponse | null>;
  update(
    accountId: string,
    account: Partial<AccountType>,
    transaction?: DrizzleTransaction,
  ): Promise<AccountType | null>;
}

export class AccountsRepositoryImpl implements IAccountsRepository {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: DrizzleDB,
  ) {}

  async findByUserId(userId: string): Promise<AccountResponse | null> {
    const [result] = await this.db
      .select()
      .from(accountModel)
      .where(eq(accountModel.userId, userId));

    return result ? AccountMapper.toResponse(result) : null;
  }

  async findByUserIdLock(
    userId: string,
    transaction?: DrizzleTransaction,
  ): Promise<AccountResponse | null> {
    const dbClient = transaction || this.db;

    const [result] = await dbClient
      .select()
      .from(accountModel)
      .where(eq(accountModel.userId, userId))
      .for('update');

    return result ? AccountMapper.toResponse(result) : null;
  }

  async update(
    accountId: string,
    accountEntity: Partial<Account>,
    transaction?: DrizzleTransaction,
  ): Promise<AccountResponse | null> {
    const dbClient = transaction || this.db;

    const [result] = await dbClient
      .update(accountModel)
      .set(accountEntity)
      .where(eq(accountModel.id, accountId))
      .returning();

    return result ? AccountMapper.toResponse(result) : null;
  }
}
