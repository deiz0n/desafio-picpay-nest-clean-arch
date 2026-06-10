import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const QUEUE_SERVICE_TOKEN = 'IQueueService';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_EMAIL_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://localhost:5672',
            ],
            queue:
              configService.get<string>('RABBITMQ_EMAIL_QUEUE') ||
              'notifications.email.queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'notifications_dlq',
              },
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: QUEUE_SERVICE_TOKEN,
      useClass: QueueService,
    },
  ],
  exports: [QUEUE_SERVICE_TOKEN],
})
export class QueueModule {}
