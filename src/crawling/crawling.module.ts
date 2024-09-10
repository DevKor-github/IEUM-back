import { CollectionModule } from '../collection/collection.module';
import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CrawlingService } from './crawling.service';
import { SlackAlertService } from './slack-alert.service';
import { CrawlingController } from './crawling.controller';
import { FirebaseService } from './firebase.service';
import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';

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
  providers: [CrawlingService, SlackAlertService, FirebaseService],
  controllers: [CrawlingController],
})
export class CrawlingModule {}
