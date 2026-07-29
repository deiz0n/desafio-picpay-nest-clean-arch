import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { QueueBody } from './queue-body';
import { Observable } from 'rxjs';

export interface IQueueService {
  sendEmail(data: QueueBody): Observable<void>;
}

@Injectable()
export class QueueService implements IQueueService {
  constructor(
    @Inject('RABBITMQ_EMAIL_CLIENT')
    private readonly clientEmail: ClientProxy,
  ) {}

  sendEmail(data: QueueBody): Observable<void> {
    return this.clientEmail.emit<void, QueueBody>('send_email', data);
  }
}
