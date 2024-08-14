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
          type: 'direct',
          options: { durable: true },
        },
        { name: 'ieum_failure', type: 'direct', options: { durable: true } },
      ],
      queues: [
        // {
        //   name: 'request_queue',
        //   exchange: 'ieum_exchange',
        //   routingKey: 'request',
        //   options: {
        //     deadLetterExchange: 'ieum_retry',
        //     deadLetterRoutingKey: 'retry',
        //   },
        // },
      ],
      prefetchCount: 1,
      connectionInitOptions: { wait: true, timeout: 20000 },
      enableDirectReplyTo: false,
    }),
    CollectionModule,
  ],
  providers: [CrawlingService, SlackAlertService],
  controllers: [CrawlingController],
})
export class CrawlingModule {}
