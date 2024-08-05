import { Module } from '@nestjs/common';

import { TaskQueueService } from './task-queue.service';
import { EventService } from './event.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerService } from './message-broker.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://localhost:5672',
      exchanges: [
        { name: 'crawling_exchange', type: 'direct' },
        { name: 'error_notifications', type: 'topic' },
      ],
      queues: [
        {
          name: 'crawling_requests',
          exchange: 'crawling_exchange',
          routingKey: 'crawl_request',
        },
        {
          name: 'crawling_results',
          exchange: 'crawling_exchange',
          routingKey: 'crawl_result',
        },
        {
          name: 'error_notifications',
          exchange: 'error_notifications',
          routingKey: 'error.*',
        },
      ],
      prefetchCount: 1,
    }),
  ],
  providers: [MessageBrokerService, TaskQueueService, EventService],
})
export class MessageBrokerModule {}
