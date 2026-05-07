import { Module } from '@nestjs/common';
import { AccountsRepositoryImpl } from './infrastructure/repositories/accounts.repository';

export const ACCOUNT_REPOSITORY_TOKEN = 'ACCOUNT_REPOSITORY_TOKEN';

@Module({
  controllers: [],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: AccountsRepositoryImpl,
    },
  ],
  exports: [ACCOUNT_REPOSITORY_TOKEN],
})
export class AccountsModule {}
