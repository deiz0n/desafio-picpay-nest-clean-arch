import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DrizzleModule,
    TransactionsModule,
    AccountsModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
