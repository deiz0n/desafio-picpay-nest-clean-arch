import { Inject } from '@nestjs/common';
import type { IAccountsRepository } from '../../../accounts/infrastructure/repositories/accounts.repository';
import type { DrizzleDB } from '../../../drizzle/drizzle.types';
import { UserRole } from '../../../users/core/user-role.enum';
import type { IUserRepository } from '../../../users/infrastructure/repositories/users.repository';
import { Transaction } from '../../core/transaction.entity';
import type { ITransactionAuthorizationGateway } from '../../infrastructure/http/authorization.gateway';
import { SendTransactionUseCase } from '../use-cases/send-transaction.use-case';
import { AccountNotFoundException } from '../../../accounts/core/errors/AccountNotFoundException';
import { UserNotFoundException } from '../../../users/core/errors/UserNotFoundException';
import { ForbiddenActionException } from '../../core/errors/ForbiddenActionException';
import { InsufficientBalanceException } from '../../core/errors/InsufficientBalanceException';
import type { ITransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import type { IQueueService } from 'src/queue/queue.service';
import { QUEUE_SERVICE_TOKEN } from 'src/queue/queue.module';
import { QueueBody } from 'src/queue/queue-body';
import { UserResponse } from 'src/users/core/user-response';

export class SendTransactionService implements SendTransactionUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly accountsRepository: IAccountsRepository,
    private readonly transactionAuthorizationGateway: ITransactionAuthorizationGateway,
    @Inject('DRIZZLE') private readonly db: DrizzleDB,
    private readonly transactionRepository: ITransactionRepository,
    @Inject(QUEUE_SERVICE_TOKEN) private readonly queueService: IQueueService,
  ) {}

  async execute(transaction: Transaction): Promise<void> {
    const payerAccount = await this.checkIfUsersAreValid(
      transaction.payerId,
      transaction.payeeId,
    );

    await this.checkIfAccountsExists(transaction.payerId, transaction.payeeId);
    await this.checkIfHasEnoughAmount(transaction.payerId, transaction.amount);

    await this.transactionAuthorizationGateway.authorize();

    await this.db.transaction(async (tx) => {
      const payerAccount = await this.accountsRepository.findByUserIdLock(
        transaction.payerId,
        tx,
      );

      const payeeAccount = await this.accountsRepository.findByUserIdLock(
        transaction.payeeId,
        tx,
      );

      if (payerAccount!.balance - transaction.amount < 0)
        throw new InsufficientBalanceException(
          'The transfer was aborted because the balance became insufficient during processing',
        );

      await this.accountsRepository.update(
        payerAccount!.id,
        { balance: payerAccount!.balance - transaction.amount },
        tx,
      );

      await this.accountsRepository.update(
        payeeAccount!.id,
        { balance: payeeAccount!.balance + transaction.amount },
        tx,
      );
    });

    await this.transactionRepository.save(transaction);

    this.queueService.sendEmail(
      new QueueBody(
        payerAccount.fullName,
        transaction.amount,
        payerAccount.email,
      ),
    );

    return;
  }

  private async checkIfHasEnoughAmount(
    userId: string,
    amount: number,
  ): Promise<void> {
    const payerAccount = await this.accountsRepository.findByUserId(userId);

    if (payerAccount!.balance - amount < 0)
      throw new InsufficientBalanceException(
        'The transfer was aborted because the balance became insufficient during processing',
      );
  }

  private async checkIfAccountsExists(
    payerId: string,
    payeeId: string,
  ): Promise<void> {
    if (!(await this.accountsRepository.findByUserId(payerId)))
      throw new AccountNotFoundException("Payer's bank account was not found");

    if (!(await this.accountsRepository.findByUserId(payeeId)))
      throw new AccountNotFoundException("Payee's bank account was not found.");
  }

  private async checkIfUsersAreValid(
    payerId: string,
    payeeId: string,
  ): Promise<UserResponse> {
    const payer = await this.userRepository.findById(payerId);
    if (!payer)
      throw new UserNotFoundException(
        'Payer user was not found in the system.',
      );
    if (payer.role !== UserRole.CUSTOMER)
      throw new ForbiddenActionException(
        'Merchants are not allowed to perform transfers, only to receive them',
      );

    const payee = await this.userRepository.findById(payeeId);
    if (!payee)
      throw new UserNotFoundException('Payee user was not found in the system');

    return payee;
  }
}
