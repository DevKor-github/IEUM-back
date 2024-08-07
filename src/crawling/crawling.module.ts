import { CollectionModule } from '../collection/collection.module';
import { Module, Global } from '@nestjs/common';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CrawlingService } from './crawling.service';
import { SlackAlertService } from './slack-alert.service';
import { CrawlingController } from './crawling.controller';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://localhost:5672',
      exchanges: [
        { name: 'ieum_exchange', type: 'direct', options: { durable: true } },
        {
          name: 'ieum_retry',
          type: 'fanout',
          options: { durable: true },
        },
        { name: 'ieum_failure', type: 'direct', options: { durable: true } },
      ],
      queues: [
        {
          name: 'request_queue',
          exchange: 'ieum_exchange',
          routingKey: 'request',
          // bindQueueArguments: {
          //   'x-dead-letter-exchange': 'ieum_retry',
          // },
          // bindQueueArguments: {},
        },
        {
          name: 'result_queue',
          exchange: 'ieum_exchange',
          routingKey: 'result',
          // bindQueueArguments: {
          //   'x-dead-letter-exchange': 'ieum_retry',
          // },
          // options: { deadLetterExchange: 'ieum_retry' },
        },
        {
          name: 'retry_queue',
          exchange: 'ieum_retry',
        },
        {
          name: 'failed_queue',
          exchange: 'ieum_failure',
          routingKey: 'failure',
        },
      ],
      prefetchCount: 1,
      connectionInitOptions: { wait: true, timeout: 20000 },
    }),
    CollectionModule,
  ],
  providers: [CrawlingService, SlackAlertService],
  controllers: [CrawlingController],
})
export class CrawlingModule {}
