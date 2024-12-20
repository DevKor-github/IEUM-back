import { CollectionModule } from '../collection/collection.module';
import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { CrawlingController } from './crawling.controller';

import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';
import { CrawlingService } from './services/crawling.service';
import { FirebaseService } from './services/firebase.service';
import { RabbitMqService } from './services/rabbitmq.service';
import { SlackAlertService } from './services/slack-alert.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: async () => ({
        uri: process.env.RABBITMQ_URI,
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
          {
            name: 'failed_queue',
            options: { durable: true },
            exchange: 'ieum_failure',
            routingKey: 'failure',
          },
        ],
        prefetchCount: 1,
        connectionInitOptions: { wait: true, timeout: 20000 },
        enableDirectReplyTo: false,
      }),
    }),
    CollectionModule,
    PlaceModule,
    UserModule,
  ],
  providers: [
    RabbitMqService,
    SlackAlertService,
    FirebaseService,
    CrawlingService,
  ],
  controllers: [CrawlingController],
})
export class CrawlingModule {}
