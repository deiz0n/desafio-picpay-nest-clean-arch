import { Module } from '@nestjs/common';
import { TransactionsController } from './infrastructure/http/transactions.controller';
import { ConfigService } from '@nestjs/config';
import {
  HttpAuthorizationGateway,
  ITransactionAuthorizationGateway,
} from './infrastructure/http/authorization.gateway';
import { HttpCircuitBreaker } from './infrastructure/http/http-circuit-breaker';
import { IHttpCircuitBreaker } from './infrastructure/http/http-circuit-breaker';
import { AccountsRepositoryImpl } from '../accounts/infrastructure/repositories/accounts.repository';
import { SendTransactionService } from './aplication/services/send-transaction.service';
import { IUserRepository } from '../users/infrastructure/repositories/users.repository';
import { DrizzleDB } from '../drizzle/drizzle.types';
import { USER_REPOSITORY_TOKEN, UsersModule } from '../users/users.module';
import {
  ACCOUNT_REPOSITORY_TOKEN,
  AccountsModule,
} from '../accounts/accounts.module';
import { DRIZZLE } from '../drizzle/drizzle.module';

export const HTTP_CIRCUIT_BREAKER_TOKEN = 'HTTP_CIRCUIT_BREAKER_TOKEN';
export const TRANSACTION_AUTHORIZATION_GATEWAY_TOKEN =
  'TRANSACTION_AUTHORIZATION_GATEWAY_TOKEN';

@Module({
  imports: [UsersModule, AccountsModule],
  controllers: [TransactionsController],
  providers: [
    {
      provide: HTTP_CIRCUIT_BREAKER_TOKEN,
      useClass: HttpCircuitBreaker,
    },
    {
      provide: 'SendTransactionUseCase',
      useFactory: (
        userRepepository: IUserRepository,
        accountRepository: AccountsRepositoryImpl,
        transactionAuthorizationGateway: ITransactionAuthorizationGateway,
        db: DrizzleDB,
      ) => {
        return new SendTransactionService(
          userRepepository,
          accountRepository,
          transactionAuthorizationGateway,
          db,
        );
      },
      inject: [
        USER_REPOSITORY_TOKEN,
        ACCOUNT_REPOSITORY_TOKEN,
        TRANSACTION_AUTHORIZATION_GATEWAY_TOKEN,
        DRIZZLE,
      ],
    },
    {
      provide: TRANSACTION_AUTHORIZATION_GATEWAY_TOKEN,
      useFactory: (
        configService: ConfigService,
        circuitBreaker: IHttpCircuitBreaker,
      ) => {
        return new HttpAuthorizationGateway(configService, circuitBreaker);
      },
      inject: [ConfigService, HTTP_CIRCUIT_BREAKER_TOKEN],
    },
  ],
})
export class TransactionsModule {}
