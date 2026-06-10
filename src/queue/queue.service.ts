import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { QueueBody } from './queue-body';

export interface IQueueService {
  sendEmail(data: QueueBody): Promise<void>;
}

@Injectable()
export class QueueService implements IQueueService {
  constructor(
    @Inject('RABBITMQ_EMAIL_CLIENT')
    private readonly clientEmail: ClientProxy,
  ) {}

  async sendEmail(data: QueueBody): Promise<void> {
    this.clientEmail.emit('send_email', data);
  }
}
