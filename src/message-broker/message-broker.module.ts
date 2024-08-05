import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerService } from './message-broker.service';
import { SlackAlertService } from './slack-alert.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://localhost:5672',
      exchanges: [
        { name: 'ieum_exchange', type: 'direct' },
        { name: 'ieum_dlx', type: 'fanout' },
      ],
      queues: [
        {
          name: 'request_queue',
          exchange: 'ieum_exchange',
          routingKey: 'request',
        },
        {
          name: 'result_queue',
          exchange: 'ieum_exchange',
          routingKey: 'result',
        },
        {
          name: 'dead_letter_queue',
          exchange: 'ieum_dlx',
        },
      ],
      prefetchCount: 1,
    }),
  ],
  providers: [MessageBrokerService, SlackAlertService],
})
export class MessageBrokerModule {}
